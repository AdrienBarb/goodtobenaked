const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../index');
const { MongoMemoryServer } = require('mongodb-memory-server');
const generateToken = require('../lib/utils/jwt');
const getCreator = require('./factory/creatorFactory');
const getMember = require('./factory/memberFactory');
const getProduct = require('./factory/productFactory');
const getOrder = require('./factory/orderFactory');
const comissionModel = require('../models/comissionModel');
const getService = require('./factory/serviceFactory');
const getServiceOrder = require('./factory/serviceOrderFactory');
const getMedia = require('./factory/mediaFactory');

require('dotenv').config();

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {});

describe('Comissions', () => {
  test('A comission is created when product order completed', async () => {
    const referrer = await getCreator({});
    const creator = await getCreator({ referrer });
    const member = await getMember({});
    const product = await getProduct({ creator, packageSize: 'small' });
    const order = await getOrder({
      seller: creator,
      buyer: member,
      product,
      state: 'accepted',
      status: 'succeeded',
    });
    const memberToken = generateToken(member?._id);

    const res = await request(app)
      .put(`/api/orders/${order?._id}/member`)
      .auth(memberToken, { type: 'bearer' })
      .send({
        state: 'completed',
      });

    expect(res.status).toBe(200);

    const createdComission = await comissionModel.find({ referrer: referrer });
    expect(createdComission.length).toBe(1);
    expect(createdComission[0].commissionAmount).toBe(0.5);
  });

  test('A comission is created when service order completed', async () => {
    const referrer = await getCreator({});
    const creator = await getCreator({ referrer });
    const member = await getMember({});
    const service = await getService(creator);
    const memberToken = generateToken(member?._id);
    const serviceOrder = await getServiceOrder(
      creator,
      member,
      'accepted',
      'succeeded',
      service,
    );

    const res = await request(app)
      .put(`/api/service-orders/${serviceOrder?._id}/edit-from-member`)
      .auth(memberToken, { type: 'bearer' })
      .send({
        state: 'completed',
      });

    expect(res.status).toBe(200);

    const createdComission = await comissionModel.find({ referrer: referrer });
    expect(createdComission.length).toBe(1);
    expect(createdComission[0].commissionAmount).toBe(1.5);
  });

  test('A comission is created when media order completed', async () => {
    const referrer = await getCreator({});
    const creator = await getCreator({ referrer });
    const member = await getMember({});
    const memberToken = generateToken(member?._id);
    const media = await getMedia(creator);

    const res = await request(app)
      .get(`/api/medias/${media?._id}/checkout/succeed`)
      .auth(memberToken, { type: 'bearer' })
      .send({
        state: 'completed',
      });

    expect(res.status).toBe(200);

    const createdComission = await comissionModel.find({ referrer: referrer });
    expect(createdComission.length).toBe(1);
    expect(createdComission[0].commissionAmount).toBe(0.5);
  });
});
