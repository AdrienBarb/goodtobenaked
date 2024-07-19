const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../index');
const createUser = require('./factory/userFactory');
const { MongoMemoryReplSet } = require('mongodb-memory-server');
const generateToken = require('../lib/utils/jwt');
const createSale = require('./factory/saleFactory');
const invoiceModel = require('../models/invoiceModel');
const saleModel = require('../models/saleModel');

let replSet;

beforeAll(async () => {
  replSet = await MongoMemoryReplSet.create({
    replSet: { count: 1 },
  });

  const uri = replSet.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.close();
  await replSet.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
});

describe('Get Balances', () => {
  test('A user can get his current balance', async () => {
    const user = await createUser({});
    const userToken = generateToken(user._id);
    const sale = await createSale({
      owner: user,
      amount: { fiatValue: 500, creditValue: 500 },
      isPaid: false,
    });

    const sale2 = await createSale({
      owner: user,
      amount: { fiatValue: 600, creditValue: 600 },
      isPaid: false,
    });

    const sale3 = await createSale({
      owner: user,
      amount: { fiatValue: 600, creditValue: 600 },
      isPaid: true,
    });

    const res = await request(app)
      .get(`/api/incomes/balances`)
      .auth(userToken, { type: 'bearer' });

    expect(res.status).toEqual(200);
    expect(res.body.balances).toEqual(880);
  });
});

describe('Get Sales', () => {
  test('A user can get his current sales', async () => {
    const user = await createUser({});
    const user2 = await createUser({});
    const userToken = generateToken(user._id);
    const sale = await createSale({
      owner: user,
      amount: { fiatValue: 500, creditValue: 500 },
      isPaid: false,
    });

    const sale2 = await createSale({
      owner: user,
      amount: { fiatValue: 600, creditValue: 600 },
      isPaid: false,
    });

    const sale3 = await createSale({
      owner: user2,
      amount: { fiatValue: 600, creditValue: 600 },
      isPaid: true,
    });

    const res = await request(app)
      .get(`/api/incomes/sales`)
      .auth(userToken, { type: 'bearer' });

    expect(res.status).toEqual(200);
    expect(res.body.sales.length).toEqual(2);
  });
});

describe('Create invoices', () => {
  test('A user can get his invoice created', async () => {
    const user = await createUser({});
    const userToken = generateToken(user._id);
    const sale = await createSale({
      owner: user,
      amount: { fiatValue: 500, creditValue: 500 },
      isPaid: false,
    });

    const sale2 = await createSale({
      owner: user,
      amount: { fiatValue: 600, creditValue: 600 },
      isPaid: false,
    });

    const sale3 = await createSale({
      owner: user,
      amount: { fiatValue: 600, creditValue: 600 },
      isPaid: true,
    });

    const res = await request(app)
      .post(`/api/incomes/create-invoice`)
      .auth(userToken, { type: 'bearer' });

    expect(res.status).toEqual(200);

    const fetchedInvoice = await invoiceModel.findOne({ user: user._id });
    expect(fetchedInvoice.toBePaid).toEqual(880);

    const fetchedSale1 = await saleModel.findById(sale._id);
    expect(fetchedSale1.isPaid).toEqual(true);

    const fetchedSale2 = await saleModel.findById(sale2._id);
    expect(fetchedSale2.isPaid).toEqual(true);
  });
});
