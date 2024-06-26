const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../index');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Notification = require('../models/notificationModel');
const getCreator = require('./factory/creatorFactory');
const nudeModel = require('../models/nudeModel');
const getMedia = require('./factory/mediaFactory');

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
  await nudeModel.deleteMany({});
});

describe('Create a nude', () => {
  test('A creator can create a nude', async () => {
    const creator = await getCreator();
    const media = await getMedia(creator);

    const res = await request(app)
      .post(`/api/nudes`)
      .auth(creatorToken, { type: 'bearer' })
      .send({
        selectedMedias: [media?._id],
        description: 'Description',
        isFree: false,
        price: 2000,
      });

    expect(res.status).toEqual(201);
    expect(res.body._id).toBeDefined();

    const nude = await nudeModel.find();
    expect(nude.length).toEqual(1);
  });
});
