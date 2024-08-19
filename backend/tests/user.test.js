const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../index');
const createUser = require('./factory/userFactory');
const { MongoMemoryReplSet } = require('mongodb-memory-server');
const generateToken = require('../lib/utils/jwt');
const saleModel = require('../models/saleModel');
const userModel = require('../models/userModel');
const moment = require('moment');

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

describe('Register', () => {
  test('A user can register', async () => {
    const res = await request(app).post(`/api/users`).send({
      pseudo: 'adrien',
      email: 'adrien@gmail.com',
      password: 'jesaispas',
    });

    expect(res.status).toEqual(201);
    expect(res.body._id).toBeDefined();
    expect(res.body.token).toBeDefined();
    expect(res.body.pseudo).toEqual('adrien');
    expect(res.body.isAccountVerified).toEqual(false);
    expect(res.body.isAmbassador).toEqual(false);
    expect(res.body.salesFee).toEqual(0.2);
    expect(res.body.creditAmount).toEqual(0);

    const fetchedUser = await userModel.findById(res.body._id);
    const expectedPromotionEndDate = moment
      .utc(fetchedUser.createdAt)
      .add(3, 'months')
      .startOf('day')
      .toDate();
    expect(fetchedUser.promotionEndDate).toEqual(expectedPromotionEndDate);
  });
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
    expect(fetchedSale.amount.fiatValue).toEqual(100);
    expect(fetchedSale.amount.creditValue).toEqual(200);
    expect(fetchedSale.isPaid).toEqual(false);
    expect(fetchedSale.fromUser).toEqual(user._id);
    const expectedAvailableDate = moment
      .utc(fetchedSale.createdAt)
      .add(7, 'days')
      .startOf('day')
      .toDate();
    expect(fetchedSale.availableDate).toEqual(expectedAvailableDate);

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

describe('Profile visit', () => {
  test('A user can visit a other user profile', async () => {
    const visitor = await createUser({});
    const visitedUser = await createUser({});
    const userToken = generateToken(visitor._id);

    const res = await request(app)
      .post(`/api/users/profile-visit`)
      .auth(userToken, { type: 'bearer' })
      .send({
        userId: visitedUser._id.toString(),
      });

    expect(res.status).toEqual(200);

    const fetchedUser = await userModel.findById(visitedUser._id);

    expect(fetchedUser.profileViewers).toEqual(
      expect.arrayContaining([visitor._id.toString()]),
    );
    expect(fetchedUser.profileViewers.length).toEqual(1);
  });

  test('A visit is created only once', async () => {
    const visitor = await createUser({});
    const visitedUser = await createUser({});
    const userToken = generateToken(visitor._id);

    await request(app)
      .post(`/api/users/profile-visit`)
      .auth(userToken, { type: 'bearer' })
      .send({
        userId: visitedUser._id.toString(),
      });

    await request(app)
      .post(`/api/users/profile-visit`)
      .auth(userToken, { type: 'bearer' })
      .send({
        userId: visitedUser._id.toString(),
      });

    const fetchedUser = await userModel.findById(visitedUser._id);
    expect(fetchedUser.profileViewers).toEqual(
      expect.arrayContaining([visitor._id.toString()]),
    );
    expect(fetchedUser.profileViewers.length).toEqual(1);
  });
});
