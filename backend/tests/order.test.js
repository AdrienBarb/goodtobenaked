const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../index');
const { MongoMemoryServer } = require('mongodb-memory-server');
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

afterEach(async () => {
  await orderModel.deleteMany({});
});

describe('Product orders', () => {
  test('A member can create a product order', async () => {
    const creator = await getCreator({});
    const member = await getMember({});
    const product = await getProduct({ creator, withOptions: true });
    const memberToken = generateToken(member?._id);

    const res = await request(app)
      .post(`/api/orders/products`)
      .auth(memberToken, { type: 'bearer' })
      .send({
        sellerId: creator._id,
        productId: product._id,
        withOptions: product.withOptions,
        packageId: product.packages[0]?._id,
      });

    expect(res.status).toBe(201);
    expect(res.body.withOptions).toBe(true);
    expect(res.body.succeed).toBe(false);
    expect(res.body.status).toBe('initialized');
    expect(res.body.state).toBe('new');
    expect(res.body.package._id).toBeDefined();
  });

  test('A member cant create an order if product isnt permanent and sold', async () => {
    const creator = await getCreator({});
    const member = await getMember({});
    const product = await getProduct({
      creator,
      permanent: false,
      saleState: 'sold',
    });
    const memberToken = generateToken(member?._id);

    const res = await request(app)
      .post(`/api/orders/products`)
      .auth(memberToken, { type: 'bearer' })
      .send({
        sellerId: creator._id,
        productId: product._id,
        withOptions: product.withOptions,
        packageId: product.packages[0]?._id,
      });

    expect(res.status).toBe(400);
  });

  test('A member cant create an order if product isnt permanent and reserved', async () => {
    const creator = await getCreator({});
    const member = await getMember({});
    const product = await getProduct({
      creator,
      permanent: false,
      saleState: 'reserved',
    });
    const memberToken = generateToken(member?._id);

    const res = await request(app)
      .post(`/api/orders/products`)
      .auth(memberToken, { type: 'bearer' })
      .send({
        sellerId: creator._id,
        productId: product._id,
        withOptions: product.withOptions,
        packageId: product.packages[0]?._id,
      });

    expect(res.status).toBe(400);
  });
});

describe('Order checkout', () => {
  test('A member can create a physical product order', async () => {
    const creator = await getCreator({});
    const member = await getMember({});
    const product = await getProduct({
      creator,
      withOptions: true,
    });
    const memberToken = generateToken(member?._id);

    const order = await getOrder({
      seller: creator,
      buyer: member,
      product: product,
    });

    const res = await request(app)
      .put(`/api/orders/${order._id}/checkout-product`)
      .auth(memberToken, { type: 'bearer' })
      .send({
        cost: 20,
        deliveryCost: 4,
        addressId: member.address._id,
      });

    expect(res.status).toBe(200);
  });

  test('A member cant create a physical product order without address', async () => {
    const creator = await getCreator({});
    const member = await getMember({});
    const product = await getProduct({
      creator,
      withOptions: true,
      productType: 'physical',
    });
    const memberToken = generateToken(member?._id);

    const order = await getOrder({
      seller: creator,
      buyer: member,
      product: product,
    });

    const res = await request(app)
      .put(`/api/orders/${order._id}/checkout-product`)
      .auth(memberToken, { type: 'bearer' })
      .send({
        cost: 20,
        deliveryCost: 4,
      });

    expect(res.status).toBe(400);
  });

  test('A member cant create a product if not permanent and sold', async () => {
    const creator = await getCreator({});
    const member = await getMember({});
    const product = await getProduct({
      creator,
      withOptions: true,
      permanent: false,
      saleState: 'sold',
    });
    const memberToken = generateToken(member?._id);

    const order = await getOrder({
      seller: creator,
      buyer: member,
      product: product,
    });

    const res = await request(app)
      .put(`/api/orders/${order._id}/checkout-product`)
      .auth(memberToken, { type: 'bearer' })
      .send({
        cost: 20,
        deliveryCost: 4,
        addressId: member.address._id,
      });

    expect(res.status).toBe(400);
  });

  test('A member cant create a product if not permanent and reserved', async () => {
    const creator = await getCreator({});
    const member = await getMember({});
    const product = await getProduct({
      creator,
      withOptions: true,
      permanent: false,
      saleState: 'reserved',
    });
    const memberToken = generateToken(member?._id);

    const order = await getOrder({
      seller: creator,
      buyer: member,
      product: product,
    });

    const res = await request(app)
      .put(`/api/orders/${order._id}/checkout-product`)
      .auth(memberToken, { type: 'bearer' })
      .send({
        cost: 20,
        deliveryCost: 4,
        addressId: member.address._id,
      });

    expect(res.status).toBe(400);
  });

  test('If product not permanent, the product sale state is reserved', async () => {
    const creator = await getCreator({});
    const member = await getMember({});
    const product = await getProduct({
      creator,
      withOptions: true,
      permanent: false,
    });
    const memberToken = generateToken(member?._id);

    const order = await getOrder({
      seller: creator,
      buyer: member,
      product: product,
    });

    const res = await request(app)
      .put(`/api/orders/${order._id}/checkout-product`)
      .auth(memberToken, { type: 'bearer' })
      .send({
        cost: 20,
        deliveryCost: 4,
        addressId: member.address._id,
      });

    expect(res.status).toBe(200);
    const fetchedProduct = await productModel.findById(product._id);
    expect(fetchedProduct.saleState).toBe('reserved');
    expect(fetchedProduct.reservedDelay).toBeDefined();
  });

  test('It create an order activity', async () => {
    const creator = await getCreator({});
    const member = await getMember({});
    const product = await getProduct({
      creator,
      withOptions: true,
      permanent: false,
    });
    const memberToken = generateToken(member?._id);

    const order = await getOrder({
      seller: creator,
      buyer: member,
      product: product,
    });

    const res = await request(app)
      .put(`/api/orders/${order._id}/checkout-product`)
      .auth(memberToken, { type: 'bearer' })
      .send({
        cost: 20,
        deliveryCost: 4,
        addressId: member.address._id,
      });

    expect(res.status).toBe(200);
    const fetchedOrder = await orderModel
      .findById(order._id)
      .populate('activities');

    expect(fetchedOrder.activities.length).toBe(1);
    expect(fetchedOrder.activities[0].type).toBe('new');
  });
});

describe('Order succeed', () => {
  test('A order is marked as succeed', async () => {
    const creator = await getCreator({});
    const member = await getMember({});
    const product = await getProduct({
      creator,
      withOptions: true,
      productType: 'virtual',
    });
    const memberToken = generateToken(member?._id);

    const order = await getOrder({
      seller: creator,
      buyer: member,
      product: product,
    });

    const res = await request(app)
      .put(`/api/orders/${order._id}/succeed`)
      .auth(memberToken, { type: 'bearer' })
      .send({
        cost: 20,
        deliveryCost: 4,
      });

    expect(res.status).toBe(200);
    const fetchedOrder = await orderModel.findById(order._id);

    expect(fetchedOrder.status).toBe('succeeded');
  });

  test('If product no permanent, it mark it as sold', async () => {
    const creator = await getCreator({});
    const member = await getMember({});
    const product = await getProduct({
      creator,
      withOptions: true,
      permanent: false,
    });
    const memberToken = generateToken(member?._id);

    const order = await getOrder({
      seller: creator,
      buyer: member,
      product: product,
    });

    const res = await request(app)
      .put(`/api/orders/${order._id}/succeed`)
      .auth(memberToken, { type: 'bearer' })
      .send({
        cost: 20,
        deliveryCost: 4,
        addressId: member.address._id,
      });

    expect(res.status).toBe(200);
    const fetchedProduct = await productModel.findById(product._id);
    expect(fetchedProduct.saleState).toBe('sold');
  });

  test('If product permanent, it still active', async () => {
    const creator = await getCreator({});
    const member = await getMember({});
    const product = await getProduct({
      creator,
      withOptions: true,
      permanent: true,
    });
    const memberToken = generateToken(member?._id);

    const order = await getOrder({
      seller: creator,
      buyer: member,
      product: product,
    });

    const res = await request(app)
      .put(`/api/orders/${order._id}/succeed`)
      .auth(memberToken, { type: 'bearer' })
      .send({
        cost: 20,
        deliveryCost: 4,
        addressId: member.address._id,
      });

    expect(res.status).toBe(200);
    const fetchedProduct = await productModel.findById(product._id);
    expect(fetchedProduct.saleState).toBe('active');
  });
});

describe('Order failed', () => {
  test('A order is marked as failed', async () => {
    const creator = await getCreator({});
    const member = await getMember({});
    const product = await getProduct({
      creator,
      withOptions: true,
      productType: 'virtual',
    });
    const memberToken = generateToken(member?._id);

    const order = await getOrder({
      seller: creator,
      buyer: member,
      product: product,
    });

    const res = await request(app)
      .put(`/api/orders/${order._id}/failed`)
      .auth(memberToken, { type: 'bearer' })
      .send({
        cost: 20,
        deliveryCost: 4,
      });

    expect(res.status).toBe(200);
    const fetchedOrder = await orderModel.findById(order._id);

    expect(fetchedOrder.status).toBe('failed');
  });

  test('If product no permanent, it mark it as active', async () => {
    const creator = await getCreator({});
    const member = await getMember({});
    const product = await getProduct({
      creator,
      withOptions: true,
      permanent: false,
      saleState: 'reserved',
    });
    const memberToken = generateToken(member?._id);

    const order = await getOrder({
      seller: creator,
      buyer: member,
      product: product,
    });

    const res = await request(app)
      .put(`/api/orders/${order._id}/failed`)
      .auth(memberToken, { type: 'bearer' })
      .send({
        cost: 20,
        deliveryCost: 4,
        addressId: member.address._id,
      });

    expect(res.status).toBe(200);
    const fetchedProduct = await productModel.findById(product._id);
    expect(fetchedProduct.saleState).toBe('active');
  });
});
