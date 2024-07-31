const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../index');
const createUser = require('./factory/userFactory');
const { MongoMemoryReplSet } = require('mongodb-memory-server');
const generateToken = require('../lib/utils/jwt');
const creditTransactionModel = require('../models/creditTransactionModel');
const config = require('../config');
const stripe = require('stripe')(config.stripeApiKey);
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

describe('Create a payment intent', () => {
  test('A user can create a payment intent', async () => {
    const user = await createUser({});
    const userToken = generateToken(user._id);

    const res = await request(app)
      .post(`/api/payments/create-payment-intent`)
      .auth(userToken, { type: 'bearer' })
      .send({
        price: 2299,
      });

    expect(res.status).toEqual(200);
    expect(res.body.clientSecret).toBeDefined();
    expect(res.body.stripeTransactionId).toBeDefined();
    expect(res.body.amount).toEqual(2299);
  });
});

describe('Checkout', () => {
  test('It create a transaction', async () => {
    const user = await createUser({});
    const userToken = generateToken(user._id);

    const res = await request(app)
      .post(`/api/payments/checkout`)
      .auth(userToken, { type: 'bearer' })
      .send({
        creditAmount: 2299,
        stripeTransactionId: '12345',
      });

    expect(res.status).toEqual(200);

    const fetchedCreditTransaction = await creditTransactionModel.findOne({
      user: user._id,
    });

    expect(fetchedCreditTransaction._id).toBeDefined();
    expect(fetchedCreditTransaction.creditAmount).toEqual(2299);
  });
});

describe('Stripe Webhook: getStripeUpdates', () => {
  test('Should return 400 if webhook signature verification fails', async () => {
    const payload = {
      id: 'evt_test_webhook',
      object: 'event',
    };

    const payloadString = JSON.stringify(payload, null, 2);
    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret: config.stripeEndpointSecret,
    });

    // Corrupt the header to simulate an invalid signature
    const invalidHeader = header.replace('v1=', 'v0=');

    const res = await request(app)
      .post('/webhook')
      .set('stripe-signature', invalidHeader)
      .send(payloadString);

    expect(res.status).toBe(400);
  });

  test('Should handle payment_intent.succeeded event', async () => {
    const user = await createUser({});

    const transaction = new creditTransactionModel({
      user: user._id,
      stripeId: 'pi_12345',
      creditAmount: 1000,
      status: 'pending',
    });
    await transaction.save();

    const paymentIntent = {
      id: 'pi_12345',
      amount: 1000,
    };

    const payload = {
      id: 'evt_test_webhook',
      type: 'payment_intent.succeeded',
      data: { object: paymentIntent },
    };

    const payloadString = JSON.stringify(payload);
    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret: config.stripeEndpointSecret,
    });

    const res = await request(app)
      .post('/webhook')
      .set('stripe-signature', header)
      .set('Content-Type', 'application/json')
      .send(payloadString);

    expect(res.status).toBe(200);

    const updatedUser = await userModel.findById(user._id);
    expect(updatedUser.creditAmount).toBe(11000);

    const updatedTransaction = await creditTransactionModel.findById(
      transaction._id,
    );
    expect(updatedTransaction.status).toBe('completed');
  });
});
