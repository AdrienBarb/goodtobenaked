const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../index');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Product = require('../models/productModel');
const Creator = require('../models/creatorModel');
const Order = require('../models/orderModel');
const Member = require('../models/memberModel');
const Notification = require('../models/notificationModel');
const Conversation = require('../models/conversationModel');
const {
  createNotification,
} = require('../lib/notification/inapp/createNotification');
const generateToken = require('../lib/utils/jwt');
const getCreator = require('./factory/creatorFactory');
const getMember = require('./factory/memberFactory');
const getProduct = require('./factory/productFactory');

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

afterEach(async () => {
  await Notification.deleteMany({});
});

describe('createNotification', () => {
  test('Member is notified when subscribed and creator upload new product', async () => {
    const member = await getMember({});
    const creator = await getCreator({ subscribers: [member._id.toString()] });
    const creatorToken = generateToken(creator?._id);
    const product = await getProduct({ creator, isDraft: true });

    const res = await request(app)
      .put(`/api/products/${product._id}/gallery`)
      .auth(creatorToken, { type: 'bearer' })
      .attach('productPicture1', 'tests/fixtures/productPicture1.png');

    const notifications = await Notification.find();

    expect(notifications.length).toEqual(1);
    expect(notifications[0].type).toEqual('newProduct');
  });

  test('Member is not notified when subscribed but not activate notification and creator upload new product', async () => {
    const member = await getMember({ inappNotification: ['message'] });
    const creator = await getCreator({ subscribers: [member._id.toString()] });
    const creatorToken = generateToken(creator?._id);
    const product = await getProduct({ creator, isDraft: true });

    const res = await request(app)
      .put(`/api/products/${product._id}/gallery`)
      .auth(creatorToken, { type: 'bearer' })
      .attach('productPicture1', 'tests/fixtures/productPicture1.png');

    const notifications = await Notification.find();

    expect(notifications.length).toEqual(0);
  });

  test('Member is not notified when not subscribed and creator upload new product', async () => {
    const member = await getMember({ inappNotification: ['message'] });
    const creator = await getCreator({});
    const creatorToken = generateToken(creator?._id);
    const product = await getProduct({ creator, isDraft: true });

    const res = await request(app)
      .put(`/api/products/${product._id}/gallery`)
      .auth(creatorToken, { type: 'bearer' })
      .attach('productPicture1', 'tests/fixtures/productPicture1.png');

    const notifications = await Notification.find();

    expect(notifications.length).toEqual(0);
  });
});
