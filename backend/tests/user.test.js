const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../index');
const nudeModel = require('../models/nudeModel');
const createMedia = require('./factory/mediaFactory');
const createUser = require('./factory/userFactory');
const { MongoMemoryReplSet } = require('mongodb-memory-server');
const generateToken = require('../lib/utils/jwt');
const createNude = require('./factory/nudeFactory');
const saleModel = require('../models/saleModel');
const userModel = require('../models/userModel');

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

describe('Send tips', () => {
  test('A user can send a tips', async () => {
    const user = await createUser({});
    const user2 = await createUser({});
    const userToken = generateToken(user._id);

    const res = await request(app)
      .post(`/api/users/send-tips`)
      .auth(userToken, { type: 'bearer' })
      .send({
        userId: user2._id.toString(),
        tipsAmount: 2,
      });

    expect(res.status).toEqual(200);

    const fetchedSale = await saleModel.findOne({ owner: user2._id });
    expect(fetchedSale.saleType).toEqual('tip');
    expect(fetchedSale.amount.fiatValue).toEqual(200);
    expect(fetchedSale.amount.creditValue).toEqual(200);
    expect(fetchedSale.isPaid).toEqual(false);
    expect(fetchedSale.fromUser).toEqual(user._id);

    const fetchedUser = await userModel.findById(user._id);
    expect(fetchedUser.creditAmount).toEqual(9800);
  });

  test('A user cant send a tips if not enough credit', async () => {
    const user = await createUser({ creditAmount: 100 });
    const user2 = await createUser({});
    const userToken = generateToken(user._id);

    const res = await request(app)
      .post(`/api/users/send-tips`)
      .auth(userToken, { type: 'bearer' })
      .send({
        userId: user2._id.toString(),
        tipsAmount: 2,
      });

    expect(res.status).toEqual(400);
  });
});
