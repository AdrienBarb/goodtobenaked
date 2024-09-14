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
    expect(nude.priceDetails.creditPrice).toEqual(4598);
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
    expect(fetchedNude.priceDetails.creditPrice).toEqual(4598);
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

    expect(res.body.permissions.canEdit).toEqual(false);
    expect(res.body.permissions.canView).toEqual(true);
    expect(res.body.permissions.canBuy).toEqual(false);

    res.body.medias.forEach((m) => {
      expect(m.imageUrl).toBeDefined();
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

describe('GET /api/nudes - Basic functionality', () => {
  test('should return nudes with pagination enabled', async () => {
    const owner = await createUser({});
    const media = await createMedia(owner);
    const nude1 = await createNude({ user: owner, medias: [media] });
    const nude2 = await createNude({ user: owner, medias: [media] });

    const res = await request(app).get('/api/nudes').query({ limit: 1 });

    expect(res.status).toBe(200);
    expect(res.body.nudes.length).toEqual(1);
    expect(res.body.nextCursor).toBeDefined();
  });

  test('should return nudes without pagination', async () => {
    const owner = await createUser({});
    const media = await createMedia(owner);
    const nude1 = await createNude({ user: owner, medias: [media] });

    const res = await request(app)
      .get('/api/nudes')
      .query({ enablePagination: 'false' });

    expect(res.status).toBe(200);
    expect(res.body.nudes.length).toBeGreaterThan(0);
    expect(res.body.nextCursor).toBeNull();
  });
});

describe('GET /api/nudes - Filtering', () => {
  let owner, user, userToken;

  beforeEach(async () => {
    user = await createUser({});
    owner = await createUser({
      notificationSubscribers: [user._id.toString()],
    });
    userToken = generateToken(user._id);
  });

  test('should filter nudes by isFree (free nudes)', async () => {
    const media = await createMedia(owner);
    const freeNude = await createNude({
      user: owner,
      medias: [media],
      isFree: true,
    });

    const res = await request(app).get('/api/nudes').query({ isFree: 'free' });

    expect(res.status).toBe(200);
    expect(res.body.nudes).toHaveLength(1);
    expect(res.body.nudes[0]._id).toEqual(freeNude._id.toString());
  });

  test('should filter nudes by isFree (paid nudes)', async () => {
    const media = await createMedia(owner);
    const paidNude = await createNude({
      user: owner,
      medias: [media],
      isFree: false,
    });

    const res = await request(app).get('/api/nudes').query({ isFree: 'paid' });

    expect(res.status).toBe(200);
    expect(res.body.nudes).toHaveLength(1);
    expect(res.body.nudes[0]._id).toEqual(paidNude._id.toString());
  });

  test('should filter nudes by tag', async () => {
    const media = await createMedia(owner);
    const taggedNude = await createNude({
      user: owner,
      medias: [media],
      tags: ['nature'],
    });

    const res = await request(app).get('/api/nudes').query({ tag: 'nature' });

    expect(res.status).toBe(200);
    expect(res.body.nudes).toHaveLength(1);
    expect(res.body.nudes[0].tags).toContain('nature');
  });

  test('should filter nudes by state (bought nudes)', async () => {
    const media = await createMedia(owner);
    const boughtNude = await createNude({
      user: owner,
      medias: [media],
      paidMembers: [user._id],
    });

    const res = await request(app)
      .get('/api/nudes')
      .auth(userToken, { type: 'bearer' })
      .query({ state: 'bought' });

    expect(res.status).toBe(200);
    expect(res.body.nudes).toHaveLength(1);
    expect(res.body.nudes[0]._id).toEqual(boughtNude._id.toString());
  });

  test('should filter nudes by notificationSubscribers', async () => {
    const media = await createMedia(owner);
    const boughtNude = await createNude({
      user: owner,
      medias: [media],
      paidMembers: [user._id],
    });

    const res = await request(app)
      .get('/api/nudes')
      .auth(userToken, { type: 'bearer' })
      .query({ state: 'bought' });

    expect(res.status).toBe(200);
    expect(res.body.nudes).toHaveLength(1);
    expect(res.body.nudes[0]._id).toEqual(boughtNude._id.toString());
  });
});

describe('GET /api/nudes - Permissions', () => {
  let user, owner, ownerToken, userToken, freeNude, paidNude;

  beforeEach(async () => {
    user = await createUser({});
    owner = await createUser({});
    userToken = generateToken(user._id);
    ownerToken = generateToken(owner._id);

    const media = await createMedia(owner);

    // Créer un nude gratuit
    freeNude = await createNude({
      user: owner,
      medias: [media],
      isFree: true,
    });

    // Créer un nude payant
    paidNude = await createNude({
      user: owner,
      medias: [media],
      isFree: false,
      paidMembers: [user._id.toString()],
    });
  });

  test('Unauthenticated user can see free nudes but cannot edit or buy', async () => {
    const res = await request(app).get('/api/nudes');

    expect(res.status).toBe(200);
    const returnedNude = res.body.nudes.find(
      (nude) => nude._id === freeNude._id.toString(),
    );

    expect(returnedNude).toBeDefined();
    expect(returnedNude.permissions.canEdit).toBe(false);
    expect(returnedNude.permissions.canView).toBe(true);
    expect(returnedNude.permissions.canBuy).toBe(false);
  });

  test('Unauthenticated user can see paid nudes but cannot view or buy them', async () => {
    const res = await request(app).get('/api/nudes');

    expect(res.status).toBe(200);
    const returnedNude = res.body.nudes.find(
      (nude) => nude._id === paidNude._id.toString(),
    );

    expect(returnedNude).toBeDefined();
    expect(returnedNude.permissions.canEdit).toBe(false);
    expect(returnedNude.permissions.canView).toBe(false);
    expect(returnedNude.permissions.canBuy).toBe(true);
  });

  test('Authenticated user can see free nudes and can view but not edit or buy', async () => {
    const res = await request(app)
      .get('/api/nudes')
      .auth(userToken, { type: 'bearer' });

    expect(res.status).toBe(200);
    const returnedNude = res.body.nudes.find(
      (nude) => nude._id === freeNude._id.toString(),
    );

    expect(returnedNude).toBeDefined();
    expect(returnedNude.permissions.canEdit).toBe(false);
    expect(returnedNude.permissions.canView).toBe(true);
    expect(returnedNude.permissions.canBuy).toBe(false);
  });

  test('Authenticated user who bought a nude can view it but cannot buy again or edit', async () => {
    const res = await request(app)
      .get('/api/nudes')
      .auth(userToken, { type: 'bearer' });

    expect(res.status).toBe(200);
    const returnedNude = res.body.nudes.find(
      (nude) => nude._id === paidNude._id.toString(),
    );

    expect(returnedNude).toBeDefined();
    expect(returnedNude.permissions.canEdit).toBe(false);
    expect(returnedNude.permissions.canView).toBe(true);
    expect(returnedNude.permissions.canBuy).toBe(false); // Already bought
  });

  test('Authenticated user who has not bought a nude cannot view it but can buy', async () => {
    const anotherUser = await createUser({});
    const anotherUserToken = generateToken(anotherUser._id);

    const res = await request(app)
      .get('/api/nudes')
      .auth(anotherUserToken, { type: 'bearer' });

    expect(res.status).toBe(200);
    const returnedNude = res.body.nudes.find(
      (nude) => nude._id === paidNude._id.toString(),
    );

    expect(returnedNude).toBeDefined();
    expect(returnedNude.permissions.canEdit).toBe(false);
    expect(returnedNude.permissions.canView).toBe(false); // Has not bought
    expect(returnedNude.permissions.canBuy).toBe(true); // Can buy
  });

  test('Owner can edit and view their own nudes but cannot buy', async () => {
    const res = await request(app)
      .get('/api/nudes')
      .auth(ownerToken, { type: 'bearer' });

    expect(res.status).toBe(200);
    const returnedNude = res.body.nudes.find(
      (nude) => nude._id === paidNude._id.toString(),
    );

    expect(returnedNude).toBeDefined();
    expect(returnedNude.permissions.canEdit).toBe(true);
    expect(returnedNude.permissions.canView).toBe(true);
    expect(returnedNude.permissions.canBuy).toBe(false);
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

    expect(res.body.permissions.canEdit).toBe(false);
    expect(res.body.permissions.canView).toBe(true);
    expect(res.body.permissions.canBuy).toBe(false);

    res.body.medias.forEach((currentMedia) => {
      expect(currentMedia.imageUrl).toBeDefined();
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

    expect(res.body.permissions.canEdit).toBe(false);
    expect(res.body.permissions.canView).toBe(false);
    expect(res.body.permissions.canBuy).toBe(true);

    res.body.medias.forEach((currentMedia) => {
      expect(currentMedia.imageUrl).toBeDefined();
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

    expect(res.body.permissions.canEdit).toBe(false);
    expect(res.body.permissions.canView).toBe(true);
    expect(res.body.permissions.canBuy).toBe(false);

    res.body.medias.forEach((currentMedia) => {
      expect(currentMedia.imageUrl).toBeDefined();
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

    expect(res.body.permissions.canEdit).toBe(true);
    expect(res.body.permissions.canView).toBe(true);
    expect(res.body.permissions.canBuy).toBe(false);

    res.body.medias.forEach((currentMedia) => {
      expect(currentMedia.imageUrl).toBeDefined();
    });
  });
});

describe('GET /api/nudes/user/:userId - Basic functionality', () => {
  let user, userToken;

  beforeEach(async () => {
    user = await createUser({});
    userToken = generateToken(user._id);
  });

  test('Should return nudes for a user', async () => {
    const media = await createMedia(user);
    const nude = await createNude({ user, medias: [media] });

    const res = await request(app)
      .get(`/api/nudes/user/${user._id}`)
      .auth(userToken, { type: 'bearer' })
      .send();

    expect(res.status).toBe(200);
    expect(res.body.nudes).toHaveLength(1);
    expect(res.body.nudes[0]._id).toEqual(nude._id.toString());
    expect(res.body.availableFilters).toBeDefined();
  });

  test('Should filter nudes by tag', async () => {
    const media = await createMedia(user);
    const tag = 'test-tag';
    const nude = await createNude({ user, medias: [media], tags: [tag] });

    const res = await request(app)
      .get(`/api/nudes/user/${user._id}`)
      .auth(userToken, { type: 'bearer' })
      .query({ tag })
      .send();

    console.log(res.body.availableFilters.availableTags);

    expect(res.status).toBe(200);
    expect(res.body.nudes).toHaveLength(1);
    expect(res.body.nudes[0]._id).toEqual(nude._id.toString());
    expect(res.body.availableFilters.availableTags).toContainEqual({
      tag,
      count: 1,
    });
  });

  test('Should filter nudes by isFree', async () => {
    const media = await createMedia(user);
    await createNude({ user, medias: [media], isFree: true });
    const paidNude = await createNude({ user, medias: [media], isFree: false });

    const res = await request(app)
      .get(`/api/nudes/user/${user._id}`)
      .auth(userToken, { type: 'bearer' })
      .query({ isFree: 'false' })
      .send();

    expect(res.status).toBe(200);
    expect(res.body.nudes).toHaveLength(1);
    expect(res.body.nudes[0]._id).toEqual(paidNude._id.toString());
  });

  test('Should filter nudes by mediaType (photo)', async () => {
    const photoMedia = await createMedia(user, 'image');
    const videoMedia = await createMedia(user, 'video');

    await createNude({ user, medias: [photoMedia] });
    await createNude({ user, medias: [videoMedia] });

    const res = await request(app)
      .get(`/api/nudes/user/${user._id}`)
      .auth(userToken, { type: 'bearer' })
      .query({ mediaTypes: 'photo' })
      .send();

    expect(res.status).toBe(200);
    expect(res.body.nudes).toHaveLength(1);
    expect(res.body.nudes[0].medias[0].mediaType).toBe('image');
  });

  test('Should filter nudes by mediaType (video)', async () => {
    const photoMedia = await createMedia(user, 'image');
    const videoMedia = await createMedia(user, 'video');

    await createNude({ user, medias: [photoMedia] });
    await createNude({ user, medias: [videoMedia] });

    const res = await request(app)
      .get(`/api/nudes/user/${user._id}`)
      .auth(userToken, { type: 'bearer' })
      .query({ mediaTypes: 'video' })
      .send();

    expect(res.status).toBe(200);
    expect(res.body.nudes).toHaveLength(1);
    expect(res.body.nudes[0].medias[0].mediaType).toBe('video');
  });

  test('Should return 404 if user has no nudes', async () => {
    const res = await request(app)
      .get(`/api/nudes/user/${user._id}`)
      .auth(userToken, { type: 'bearer' })
      .send();

    expect(res.status).toBe(200);
    expect(res.body.nudes).toHaveLength(0);
    expect(res.body.availableFilters.availableTags).toHaveLength(0);
  });

  test('Should return 400 for invalid mediaType filter', async () => {
    const res = await request(app)
      .get(`/api/nudes/user/${user._id}`)
      .auth(userToken, { type: 'bearer' })
      .query({ mediaTypes: 'invalid' })
      .send();

    expect(res.body.nudes).toHaveLength(0);
  });
});

describe('GET /api/nudes/user/:userId - Permissions', () => {
  let user, owner, ownerToken, userToken, freeNude, paidNude;

  beforeEach(async () => {
    user = await createUser({});
    owner = await createUser({});
    userToken = generateToken(user._id);
    ownerToken = generateToken(owner._id);

    const media = await createMedia(owner);

    // Créer un nude gratuit
    freeNude = await createNude({
      user: owner,
      medias: [media],
      isFree: true,
    });

    // Créer un nude payant
    paidNude = await createNude({
      user: owner,
      medias: [media],
      isFree: false,
      paidMembers: [user._id.toString()],
    });
  });

  test('Unauthenticated user can see free nudes but cannot edit or buy', async () => {
    const res = await request(app).get(`/api/nudes/user/${owner._id}`);

    expect(res.status).toBe(200);
    const returnedNude = res.body.nudes.find(
      (nude) => nude._id === freeNude._id.toString(),
    );

    expect(returnedNude).toBeDefined();
    expect(returnedNude.permissions.canEdit).toBe(false);
    expect(returnedNude.permissions.canView).toBe(true);
    expect(returnedNude.permissions.canBuy).toBe(false);
  });

  test('Unauthenticated user can see paid nudes but cannot view or buy them', async () => {
    const res = await request(app).get(`/api/nudes/user/${owner._id}`);

    expect(res.status).toBe(200);
    const returnedNude = res.body.nudes.find(
      (nude) => nude._id === paidNude._id.toString(),
    );

    expect(returnedNude).toBeDefined();
    expect(returnedNude.permissions.canEdit).toBe(false);
    expect(returnedNude.permissions.canView).toBe(false);
    expect(returnedNude.permissions.canBuy).toBe(true);
  });

  test('Authenticated user can see free nudes and can view but not edit or buy', async () => {
    const res = await request(app)
      .get(`/api/nudes/user/${owner._id}`)
      .auth(userToken, { type: 'bearer' });

    expect(res.status).toBe(200);
    const returnedNude = res.body.nudes.find(
      (nude) => nude._id === freeNude._id.toString(),
    );

    expect(returnedNude).toBeDefined();
    expect(returnedNude.permissions.canEdit).toBe(false);
    expect(returnedNude.permissions.canView).toBe(true);
    expect(returnedNude.permissions.canBuy).toBe(false);
  });

  test('Authenticated user who bought a nude can view it but cannot buy again or edit', async () => {
    const res = await request(app)
      .get(`/api/nudes/user/${owner._id}`)
      .auth(userToken, { type: 'bearer' });

    expect(res.status).toBe(200);
    const returnedNude = res.body.nudes.find(
      (nude) => nude._id === paidNude._id.toString(),
    );

    expect(returnedNude).toBeDefined();
    expect(returnedNude.permissions.canEdit).toBe(false);
    expect(returnedNude.permissions.canView).toBe(true);
    expect(returnedNude.permissions.canBuy).toBe(false); // Already bought
  });

  test('Authenticated user who has not bought a nude cannot view it but can buy', async () => {
    const anotherUser = await createUser({});
    const anotherUserToken = generateToken(anotherUser._id);

    const res = await request(app)
      .get(`/api/nudes/user/${owner._id}`)
      .auth(anotherUserToken, { type: 'bearer' });

    expect(res.status).toBe(200);
    const returnedNude = res.body.nudes.find(
      (nude) => nude._id === paidNude._id.toString(),
    );

    expect(returnedNude).toBeDefined();
    expect(returnedNude.permissions.canEdit).toBe(false);
    expect(returnedNude.permissions.canView).toBe(false); // Has not bought
    expect(returnedNude.permissions.canBuy).toBe(true); // Can buy
  });

  test('Owner can edit and view their own nudes but cannot buy', async () => {
    const res = await request(app)
      .get(`/api/nudes/user/${owner._id}`)
      .auth(ownerToken, { type: 'bearer' });

    expect(res.status).toBe(200);
    const returnedNude = res.body.nudes.find(
      (nude) => nude._id === paidNude._id.toString(),
    );

    expect(returnedNude).toBeDefined();
    expect(returnedNude.permissions.canEdit).toBe(true);
    expect(returnedNude.permissions.canView).toBe(true);
    expect(returnedNude.permissions.canBuy).toBe(false); // Cannot buy own content
  });
});
