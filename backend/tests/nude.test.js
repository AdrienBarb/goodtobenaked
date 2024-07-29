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
const moment = require('moment');
const conversationModel = require('../models/conversationModel');
const messageModel = require('../models/messageModel');

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

describe('Create a nude', () => {
  test('A user can create a nude', async () => {
    const user = await createUser({});
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
    const user = await createUser({});
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
    const user = await createUser({});
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
    const user = await createUser({});
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
    const user1 = await createUser({});
    const user2 = await createUser({});
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
    const user = await createUser({});
    const owner = await createUser({});
    const media = await createMedia(owner);
    const nude = await createNude({
      user: owner,
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
    const user = await createUser({});
    const owner = await createUser({});
    const media = await createMedia(owner);
    const nude = await createNude({ user: owner, medias: [media] });
    const userToken = generateToken(user._id);

    const res = await request(app)
      .post(`/api/nudes/buy`)
      .auth(userToken, { type: 'bearer' })
      .send({
        nudeId: nude._id,
      });

    expect(res.status).toEqual(200);

    res.body.medias.forEach((m) => {
      expect(m.blurredKey).toBeDefined();
      expect(m.posterKey).toBeDefined();
      expect(m.convertedKey).toBeDefined();
    });

    const fetchedNude = await nudeModel.findById(nude._id);
    expect(fetchedNude.paidMembers).toEqual(
      expect.arrayContaining([user._id.toString()]),
    );

    const fetchedSale = await saleModel.findOne({ owner: owner._id });
    expect(fetchedSale.amount.fiatValue).toEqual(3000);
    expect(fetchedSale.amount.creditValue).toEqual(3000);
    const expectedAvailableDate = moment
      .utc(fetchedSale.createdAt)
      .add(7, 'days')
      .startOf('day')
      .toDate();
    expect(fetchedSale.availableDate).toEqual(expectedAvailableDate);

    const fetchedUser = await userModel.findById(user._id);
    expect(fetchedUser.creditAmount).toEqual(7000);
  });

  test('A user cant buy a nude if not enough credit', async () => {
    const user = await createUser({ creditAmount: 1000 });
    const owner = await createUser({});
    const media = await createMedia(owner);
    const nude = await createNude({ user: owner, medias: [media] });
    const userToken = generateToken(user._id);

    const res = await request(app)
      .post(`/api/nudes/buy`)
      .auth(userToken, { type: 'bearer' })
      .send({
        nudeId: nude._id,
      });

    expect(res.status).toEqual(400);
  });

  test('The userId is added in the nudeBuyers array of the owner', async () => {
    const user = await createUser({});
    const owner = await createUser({});
    const media = await createMedia(owner);
    const nude = await createNude({ user: owner, medias: [media] });
    const userToken = generateToken(user._id);

    const res = await request(app)
      .post(`/api/nudes/buy`)
      .auth(userToken, { type: 'bearer' })
      .send({
        nudeId: nude._id,
      });

    const fetchedOwner = await userModel.findById(owner._id);
    expect(fetchedOwner.nudeBuyers).toEqual(
      expect.arrayContaining([user._id.toString()]),
    );
    expect(fetchedOwner.nudeBuyers.length).toEqual(1);
  });

  test('The userId is added in the nudeBuyers array of the owner only once', async () => {
    const user = await createUser({});
    const owner = await createUser({});
    const media = await createMedia(owner);
    const nude = await createNude({ user: owner, medias: [media] });
    const userToken = generateToken(user._id);

    await request(app)
      .post(`/api/nudes/buy`)
      .auth(userToken, { type: 'bearer' })
      .send({
        nudeId: nude._id,
      });

    await request(app)
      .post(`/api/nudes/buy`)
      .auth(userToken, { type: 'bearer' })
      .send({
        nudeId: nude._id,
      });

    const fetchedOwner = await userModel.findById(owner._id);
    expect(fetchedOwner.nudeBuyers).toEqual(
      expect.arrayContaining([user._id.toString()]),
    );
    expect(fetchedOwner.nudeBuyers.length).toEqual(1);
  });
});

describe('Create a push', () => {
  test('A user can create a push', async () => {
    const user1 = await createUser({});
    const user2 = await createUser({ userType: 'member' });
    const user3 = await createUser({ userType: 'member' });
    const user4 = await createUser({ userType: 'member' });

    //create owner
    const owner = await createUser({
      notificationSubscribers: [user1._id.toString(), user2._id.toString()],
      profileViewers: [user2._id.toString(), user3._id.toString()],
      messageSenders: [user3._id.toString(), user4._id.toString()],
      nudeBuyers: [user4._id.toString()],
    });
    const media = await createMedia(owner);
    const ownerToken = generateToken(owner._id);

    const res = await request(app)
      .post(`/api/nudes/push`)
      .auth(ownerToken, { type: 'bearer' })
      .send({
        selectedMedias: [media._id],
        message: 'Description',
        isFree: false,
        price: 22.99,
        usersList: [
          'notificationSubscribers',
          'profileViewers',
          'messageSenders',
          'nudeBuyers',
        ],
      });

    expect(res.status).toEqual(201);

    const fetchedConversations = await conversationModel.find();
    expect(fetchedConversations.length).toEqual(3);

    const fetchedMessages = await messageModel.find();
    expect(fetchedMessages.length).toEqual(3);
  });
});

describe('Get All Nudes', () => {
  test('if not connected : A user can see free nudes', async () => {
    const user = await createUser({});
    const owner = await createUser({});
    const media = await createMedia(owner);
    const media2 = await createMedia(owner);
    const media3 = await createMedia(owner);
    const nude = await createNude({
      user: owner,
      medias: [media],
    });
    const nude2 = await createNude({
      user: owner,
      medias: [media2],
    });
    const nude3 = await createNude({
      user: owner,
      medias: [media3],
    });

    const res = await request(app).get(`/api/nudes`);

    expect(res.status).toEqual(200);

    res.body.nudes.forEach((currentNude) => {
      currentNude.medias.forEach((currentMedia) => {
        expect(currentMedia.blurredKey).toBeDefined();
        expect(currentMedia.posterKey).toBeDefined();
        expect(currentMedia.convertedKey).not.toBeNull();
      });
    });
  });

  test('if not connected : A user cant see paid nudes ', async () => {
    const user = await createUser({});
    const owner = await createUser({});
    const media = await createMedia(owner);
    const media2 = await createMedia(owner);
    const media3 = await createMedia(owner);
    const nude = await createNude({
      user: owner,
      medias: [media],
      isFree: false,
      paidMembers: [user._id.toString()],
    });
    const nude2 = await createNude({
      user: owner,
      medias: [media2],
      isFree: false,
      paidMembers: [user._id.toString()],
    });
    const nude3 = await createNude({
      user: owner,
      medias: [media3],
      isFree: false,
      paidMembers: [user._id.toString()],
    });

    const res = await request(app).get(`/api/nudes`);

    expect(res.status).toEqual(200);

    res.body.nudes.forEach((currentNude) => {
      currentNude.medias.forEach((currentMedia) => {
        expect(currentMedia.blurredKey).toBeDefined();
        expect(currentMedia.posterKey).toBeDefined();
        expect(currentMedia.convertedKey).toEqual(null);
      });
    });
    expect(res.body.nudes.length).toEqual(3);
  });

  test('if connected : A user can see bought nudes', async () => {
    const user = await createUser({});
    const owner = await createUser({});
    const media = await createMedia(owner);
    const media2 = await createMedia(owner);
    const media3 = await createMedia(owner);
    const nude = await createNude({
      user: owner,
      medias: [media],
      isFree: false,
      paidMembers: [user._id.toString()],
    });
    const nude2 = await createNude({
      user: owner,
      medias: [media2],
      isFree: false,
      paidMembers: [user._id.toString()],
    });
    const nude3 = await createNude({
      user: owner,
      medias: [media3],
      isFree: false,
      paidMembers: [user._id.toString()],
    });

    const userToken = generateToken(user._id);

    const res = await request(app)
      .get(`/api/nudes`)
      .auth(userToken, { type: 'bearer' });

    expect(res.status).toEqual(200);

    res.body.nudes.forEach((currentNude) => {
      currentNude.medias.forEach((currentMedia) => {
        expect(currentMedia.blurredKey).toBeDefined();
        expect(currentMedia.posterKey).toBeDefined();
        expect(currentMedia.convertedKey).not.toBeNull();
      });
    });
    expect(res.body.nudes.length).toEqual(3);
  });

  test('if connected : A user cant see paid nudes', async () => {
    const user = await createUser({});
    const owner = await createUser({});
    const media = await createMedia(owner);
    const media2 = await createMedia(owner);
    const media3 = await createMedia(owner);
    const nude = await createNude({
      user: owner,
      medias: [media],
      isFree: false,
    });
    const nude2 = await createNude({
      user: owner,
      medias: [media2],
      isFree: false,
    });
    const nude3 = await createNude({
      user: owner,
      medias: [media3],
      isFree: false,
    });

    const userToken = generateToken(user._id);

    const res = await request(app)
      .get(`/api/nudes`)
      .auth(userToken, { type: 'bearer' });

    expect(res.status).toEqual(200);

    res.body.nudes.forEach((currentNude) => {
      currentNude.medias.forEach((currentMedia) => {
        expect(currentMedia.blurredKey).toBeDefined();
        expect(currentMedia.posterKey).toBeDefined();
        expect(currentMedia.convertedKey).toBeNull();
      });
    });
    expect(res.body.nudes.length).toEqual(3);
  });

  test('if connected : A user can see his nudes', async () => {
    const user = await createUser({});
    const owner = await createUser({});
    const media = await createMedia(owner);
    const media2 = await createMedia(owner);
    const media3 = await createMedia(owner);
    const nude = await createNude({
      user: owner,
      medias: [media],
      isFree: false,
    });
    const nude2 = await createNude({
      user: owner,
      medias: [media2],
      isFree: false,
    });
    const nude3 = await createNude({
      user: owner,
      medias: [media3],
      isFree: false,
    });

    const ownerToken = generateToken(owner._id);

    const res = await request(app)
      .get(`/api/nudes`)
      .auth(ownerToken, { type: 'bearer' });

    expect(res.status).toEqual(200);

    res.body.nudes.forEach((currentNude) => {
      currentNude.medias.forEach((currentMedia) => {
        expect(currentMedia.blurredKey).toBeDefined();
        expect(currentMedia.posterKey).toBeDefined();
        expect(currentMedia.convertedKey).not.toBeNull();
      });
    });
    expect(res.body.nudes.length).toEqual(3);
  });

  test('A user cant see archived nudes', async () => {
    const user = await createUser({});
    const owner = await createUser({});
    const media = await createMedia(owner);
    const media2 = await createMedia(owner);
    const media3 = await createMedia(owner);
    const nude = await createNude({
      user: owner,
      medias: [media],
      isArchived: true,
    });
    const nude2 = await createNude({
      user: owner,
      medias: [media2],
      isArchived: true,
    });
    const nude3 = await createNude({
      user: owner,
      medias: [media3],
      isArchived: true,
    });

    const userToken = generateToken(user._id);

    const res = await request(app)
      .get(`/api/nudes`)
      .auth(userToken, { type: 'bearer' });

    expect(res.status).toEqual(200);
    expect(res.body.nudes.length).toEqual(0);
  });

  test('A user cant see private nudes', async () => {
    const user = await createUser({});
    const owner = await createUser({});
    const media = await createMedia(owner);
    const media2 = await createMedia(owner);
    const media3 = await createMedia(owner);
    const nude = await createNude({
      user: owner,
      medias: [media],
      visibility: 'private',
    });
    const nude2 = await createNude({
      user: owner,
      medias: [media2],
      visibility: 'private',
    });
    const nude3 = await createNude({
      user: owner,
      medias: [media3],
      visibility: 'private',
    });

    const userToken = generateToken(user._id);

    const res = await request(app)
      .get(`/api/nudes`)
      .auth(userToken, { type: 'bearer' });

    expect(res.status).toEqual(200);
    expect(res.body.nudes.length).toEqual(0);
  });
});

describe('Get Current Nude', () => {
  test('A user can see free nude', async () => {
    const user = await createUser({});
    const owner = await createUser({});
    const media = await createMedia(owner);
    const media2 = await createMedia(owner);
    const media3 = await createMedia(owner);
    const nude = await createNude({
      user: owner,
      medias: [media, media2, media3],
    });

    const userToken = generateToken(user._id);

    const res = await request(app)
      .get(`/api/nudes/${nude._id}`)
      .auth(userToken, { type: 'bearer' });

    expect(res.status).toEqual(200);

    res.body.medias.forEach((currentMedia) => {
      expect(currentMedia.blurredKey).toBeDefined();
      expect(currentMedia.posterKey).toBeDefined();
      expect(currentMedia.convertedKey).not.toBeNull();
    });
  });

  test('A user cant see paid nude', async () => {
    const user = await createUser({});
    const owner = await createUser({});
    const media = await createMedia(owner);
    const media2 = await createMedia(owner);
    const media3 = await createMedia(owner);
    const nude = await createNude({
      user: owner,
      medias: [media, media2, media3],
      isFree: false,
    });

    const userToken = generateToken(user._id);

    const res = await request(app)
      .get(`/api/nudes/${nude._id}`)
      .auth(userToken, { type: 'bearer' });

    expect(res.status).toEqual(200);

    res.body.medias.forEach((currentMedia) => {
      expect(currentMedia.blurredKey).toBeDefined();
      expect(currentMedia.posterKey).toBeDefined();
      expect(currentMedia.convertedKey).toBeNull();
    });
  });

  test('A user can see bought nude', async () => {
    const user = await createUser({});
    const owner = await createUser({});
    const media = await createMedia(owner);
    const media2 = await createMedia(owner);
    const media3 = await createMedia(owner);
    const nude = await createNude({
      user: owner,
      medias: [media, media2, media3],
      isFree: false,
      paidMembers: [user._id.toString()],
    });

    const userToken = generateToken(user._id);

    const res = await request(app)
      .get(`/api/nudes/${nude._id}`)
      .auth(userToken, { type: 'bearer' });

    expect(res.status).toEqual(200);

    res.body.medias.forEach((currentMedia) => {
      expect(currentMedia.blurredKey).toBeDefined();
      expect(currentMedia.posterKey).toBeDefined();
      expect(currentMedia.convertedKey).not.toBeNull();
    });
  });

  test('A owner can see his nude', async () => {
    const user = await createUser({});
    const owner = await createUser({});
    const media = await createMedia(owner);
    const media2 = await createMedia(owner);
    const media3 = await createMedia(owner);
    const nude = await createNude({
      user: owner,
      medias: [media, media2, media3],
      isFree: false,
    });

    const ownerToken = generateToken(owner._id);

    const res = await request(app)
      .get(`/api/nudes/${nude._id}`)
      .auth(ownerToken, { type: 'bearer' });

    expect(res.status).toEqual(200);

    res.body.medias.forEach((currentMedia) => {
      expect(currentMedia.blurredKey).toBeDefined();
      expect(currentMedia.posterKey).toBeDefined();
      expect(currentMedia.convertedKey).not.toBeNull();
    });
  });
});
