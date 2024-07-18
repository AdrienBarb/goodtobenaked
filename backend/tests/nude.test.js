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

// Connection à la base de données avant tous les tests
beforeAll(async () => {
  replSet = await MongoMemoryReplSet.create({
    replSet: { count: 1 },
  });

  const uri = replSet.getUri();
  await mongoose.connect(uri);
});

// Fermeture de la connexion après tous les tests
afterAll(async () => {
  await mongoose.connection.close();
  await replSet.stop();
});

// Nettoyage de la base de données après chaque test
afterEach(async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
});

describe('Create a nude', () => {
  test('A user can create a nude', async () => {
    const user = await createUser();
    const media = await createMedia(user);
    const userToken = generateToken(user._id);

    const res = await request(app)
      .post(`/api/nudes`)
      .auth(userToken, { type: 'bearer' })
      .send({
        selectedMedias: [media._id],
        description: 'Description',
        isFree: false,
        visibility: 'public',
        price: 22.99,
      });

    expect(res.status).toEqual(201);
    expect(res.body._id).toBeDefined();

    const nude = await nudeModel.findById(res.body._id);

    expect(nude._id).toBeDefined();
    expect(nude.priceDetails.fiatPrice).toEqual(2299);
    expect(nude.priceDetails.creditPrice).toEqual(2299);
    expect(nude.description).toEqual('Description');
    expect(nude.visibility).toEqual('public');
  });
});

describe('Edit a nude', () => {
  test('A user can edit a nude', async () => {
    const user = await createUser();
    const media = await createMedia(user);
    const nude = await createNude({ user, medias: [media] });
    const userToken = generateToken(user._id);

    const res = await request(app)
      .put(`/api/nudes/${nude._id}`)
      .auth(userToken, { type: 'bearer' })
      .send({
        description: 'Updated description',
        isFree: true,
        price: 22.99,
      });

    expect(res.status).toEqual(200);
    expect(res.body._id).toBeDefined();

    const fetchedNude = await nudeModel.findById(res.body._id);

    expect(fetchedNude._id).toBeDefined();
    expect(fetchedNude.priceDetails.fiatPrice).toEqual(2299);
    expect(fetchedNude.priceDetails.creditPrice).toEqual(2299);
    expect(fetchedNude.description).toEqual('Updated description');
    expect(fetchedNude.isFree).toEqual(true);
  });

  test('Should return 400 if required fields are missing', async () => {
    const user = await createUser();
    const media = await createMedia(user);
    const nude = await createNude({ user, medias: [media] });
    const userToken = generateToken(user._id);

    const res = await request(app)
      .put(`/api/nudes/${nude._id}`)
      .auth(userToken, { type: 'bearer' })
      .send({
        // Missing description and price fields
      });

    expect(res.status).toEqual(400);
  });

  test('Should return 404 if nude does not exist', async () => {
    const user = await createUser();
    const userToken = generateToken(user._id);
    const nonExistentId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .put(`/api/nudes/${nonExistentId}`)
      .auth(userToken, { type: 'bearer' })
      .send({
        description: 'Description',
        isFree: false,
        price: 22.99,
      });

    expect(res.status).toEqual(404);
  });

  test('Should return 400 if user is not authorized to edit', async () => {
    const user1 = await createUser();
    const user2 = await createUser();
    const media = await createMedia(user1);
    const nude = await createNude({ user: user1, medias: [media] });
    const user2Token = generateToken(user2._id);

    const res = await request(app)
      .put(`/api/nudes/${nude._id}`)
      .auth(user2Token, { type: 'bearer' })
      .send({
        description: 'Description',
        isFree: false,
        price: 22.99,
      });

    expect(res.status).toEqual(400);
  });

  test('Should return 400 if nude visibility is private', async () => {
    const user = await createUser();
    const media = await createMedia(user);
    const nude = await createNude({
      user,
      medias: [media],
      visibility: 'private',
    });
    const userToken = generateToken(user._id);

    const res = await request(app)
      .put(`/api/nudes/${nude._id}`)
      .auth(userToken, { type: 'bearer' })
      .send({
        description: 'Description',
        isFree: false,
        price: 22.99,
      });

    expect(res.status).toEqual(400);
  });
});

describe('Buy a nude', () => {
  test('A user can buy a nude', async () => {
    const user = await createUser();
    const media = await createMedia(user);
    const nude = await createNude({ user, medias: [media] });
    const userToken = generateToken(user._id);

    const res = await request(app)
      .post(`/api/nudes/buy`)
      .auth(userToken, { type: 'bearer' })
      .send({
        nudeId: nude._id,
      });

    expect(res.status).toEqual(200);

    const fetchedNude = await nudeModel.findById(nude._id);
    expect(fetchedNude.paidMembers).toEqual(
      expect.arrayContaining([user._id.toString()]),
    );

    const fetchedSale = await saleModel.findOne({ nude: nude._id });
    expect(fetchedSale.amount.fiatValue).toEqual(3000);
    expect(fetchedSale.amount.creditValue).toEqual(3000);

    const fetchedUser = await userModel.findById(user._id);
    expect(fetchedUser.creditAmount).toEqual(7000);
  });

  test('A user cant buy a nude if not enough credit', async () => {
    const user = await createUser(1000);
    const media = await createMedia(user);
    const nude = await createNude({ user, medias: [media] });
    const userToken = generateToken(user._id);

    const res = await request(app)
      .post(`/api/nudes/buy`)
      .auth(userToken, { type: 'bearer' })
      .send({
        nudeId: nude._id,
      });

    expect(res.status).toEqual(400);
  });
});
