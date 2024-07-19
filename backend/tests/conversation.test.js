const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../index');
const createUser = require('./factory/userFactory');
const { MongoMemoryReplSet } = require('mongodb-memory-server');
const generateToken = require('../lib/utils/jwt');
const createConversation = require('./factory/conversationFactory');
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

describe('Send a message', () => {
  test('A creator can send a message to a member', async () => {
    const user = await createUser({ userType: 'creator' });
    const user2 = await createUser({ userType: 'member' });
    const userToken = generateToken(user._id);
    const conversation = await createConversation({
      participants: [user, user2],
    });

    const res = await request(app)
      .post(`/api/conversations/${conversation._id.toString()}/messages`)
      .auth(userToken, { type: 'bearer' })
      .send({ text: 'coucou' });

    expect(res.status).toEqual(201);

    const fetchedSale = await saleModel.findOne({ owner: user2._id });
    expect(fetchedSale).toBeNull();
  });

  test('A member cant send a message to a creator if not enough credit', async () => {
    const user = await createUser({ userType: 'member', creditAmount: 10 });
    const user2 = await createUser({ userType: 'creator' });
    const userToken = generateToken(user._id);
    const conversation = await createConversation({
      participants: [user, user2],
    });

    const res = await request(app)
      .post(`/api/conversations/${conversation._id.toString()}/messages`)
      .auth(userToken, { type: 'bearer' })
      .send({ text: 'coucou' });

    expect(res.status).toEqual(400);
  });

  test('A member can send a message to a creator if enough credit', async () => {
    const user = await createUser({ userType: 'member', creditAmount: 30 });
    const user2 = await createUser({ userType: 'creator' });
    const userToken = generateToken(user._id);
    const conversation = await createConversation({
      participants: [user, user2],
    });

    const res = await request(app)
      .post(`/api/conversations/${conversation._id.toString()}/messages`)
      .auth(userToken, { type: 'bearer' })
      .send({ text: 'coucou' });

    expect(res.status).toEqual(201);

    const fetchedSale = await saleModel.findOne({ owner: user2._id });
    expect(fetchedSale.saleType).toEqual('message');
    expect(fetchedSale.fromUser.toString()).toEqual(user._id.toString());
    expect(fetchedSale.amount.fiatValue).toEqual(25);
    expect(fetchedSale.amount.creditValue).toEqual(25);

    const fetchedUser = await userModel.findById(user._id);
    expect(fetchedUser.creditAmount).toEqual(5);
  });
});
