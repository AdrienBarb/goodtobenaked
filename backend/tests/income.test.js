const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../index');
const { MongoMemoryServer } = require('mongodb-memory-server');

const Order = require('../models/orderModel');
const Comission = require('../models/comissionModel');
const generateToken = require('../lib/utils/jwt');

const getCreator = require('./factory/creatorFactory');
const getMember = require('./factory/memberFactory');
const getProduct = require('./factory/productFactory');
const getOrder = require('./factory/orderFactory');
const productModel = require('../models/productModel');
const orderModel = require('../models/orderModel');

require('dotenv').config();

let mongoServer;

//Connecting to the database before each test.
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

//Closing database connection after each test.
afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('getIncomes', () => {
  test('Get incomes with order packages and options', async () => {
    const creator = await getCreator({});
    const member = await getMember({});
    const product = await getProduct({
      creator,
      withOptions: true,
      permanent: false,
      saleState: 'reserved',
    });
    const order = await getOrder({
      seller: creator,
      buyer: member,
      product: product,
      withOptions: product.withOptions,
      selectedPackage: product.packages[0],
      options: [product.packages[0].options[0], product.packages[0].options[1]],
      state: 'completed',
      status: 'succeeded',
    });
    const creatorToken = generateToken(creator?._id);

    const res = await request(app)
      .get('/api/incomes')
      .auth(creatorToken, { type: 'bearer' });

    expect(res.statusCode).toBe(200);
    expect(res.body[0].totalGain).toBe(32);
    expect(res.body[0].totalCommissionWithoutTax).toBe(4.5);
    expect(res.body[0].totalCommission).toBe(5.4);
  });

  test('Get incomes with single physical product', async () => {
    const creator = await getCreator({});
    const member = await getMember({});
    const product = await getProduct({
      creator,
      withOptions: false,
      permanent: false,
      saleState: 'reserved',
    });
    const order = await getOrder({
      seller: creator,
      buyer: member,
      product: product,
      withOptions: product.withOptions,
      state: 'completed',
      status: 'succeeded',
    });
    const creatorToken = generateToken(creator?._id);

    const res = await request(app)
      .get('/api/incomes')
      .auth(creatorToken, { type: 'bearer' });

    expect(res.statusCode).toBe(200);
    expect(res.body[0].totalGain).toBe(12);
    expect(res.body[0].totalCommissionWithoutTax).toBe(1.5);
    expect(res.body[0].totalCommission).toBe(1.8);
  });
});
