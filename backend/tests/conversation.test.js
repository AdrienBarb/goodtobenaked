const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../index');
const createUser = require('./factory/userFactory');
const { MongoMemoryReplSet } = require('mongodb-memory-server');
const generateToken = require('../lib/utils/jwt');
const createConversation = require('./factory/conversationFactory');
const saleModel = require('../models/saleModel');
const userModel = require('../models/userModel');
const moment = require('moment');
const createMessage = require('./factory/messageFactory');

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
    expect(fetchedSale.amount.fiatValue).toEqual(10);
    expect(fetchedSale.amount.creditValue).toEqual(20);
    const expectedAvailableDate = moment
      .utc(fetchedSale.createdAt)
      .add(7, 'days')
      .startOf('day')
      .toDate();
    expect(fetchedSale.availableDate).toEqual(expectedAvailableDate);

    const fetchedUser = await userModel.findById(user._id);
    expect(fetchedUser.creditAmount).toEqual(10);
  });
});

describe('Create conversation', () => {
  test('userId is added in messageSenders', async () => {
    const user = await createUser({});
    const user2 = await createUser({});
    const userToken = generateToken(user._id);

    const res = await request(app)
      .post(`/api/conversations`)
      .auth(userToken, { type: 'bearer' })
      .send({ userId: user2._id.toString() });

    expect(res.status).toEqual(201);

    const fetchedUser2 = await userModel.findById(user2._id);

    expect(fetchedUser2.messageSenders).toEqual(
      expect.arrayContaining([user._id.toString()]),
    );
    expect(fetchedUser2.messageSenders.length).toEqual(1);
  });

  test('userId is added in messageSenders only once', async () => {
    const user = await createUser({});
    const user2 = await createUser({});
    const userToken = generateToken(user._id);

    await request(app)
      .post(`/api/conversations`)
      .auth(userToken, { type: 'bearer' })
      .send({ userId: user2._id.toString() });

    await request(app)
      .post(`/api/conversations`)
      .auth(userToken, { type: 'bearer' })
      .send({ userId: user2._id.toString() });

    const fetchedUser2 = await userModel.findById(user2._id);

    expect(fetchedUser2.messageSenders).toEqual(
      expect.arrayContaining([user._id.toString()]),
    );
    expect(fetchedUser2.messageSenders.length).toEqual(1);
  });
});

describe('Get all conversations', () => {
  test('should return conversations in the correct order', async () => {
    const user1 = await createUser({});
    const user2 = await createUser({});
    const user3 = await createUser({});
    const user4 = await createUser({});

    const connectedUser = await createUser({});
    const connectedUserToken = generateToken(connectedUser._id);

    const conv1 = await createConversation({
      participants: [connectedUser._id, user1._id],
    });
    const msg1 = await createMessage({
      sender: connectedUser._id,
      text: 'Message 1',
      conversation: conv1._id,
    });
    conv1.messages.push(msg1._id);
    await conv1.save();

    const conv2 = await createConversation({
      participants: [connectedUser._id, user2._id],
    });
    const msg2 = await createMessage({
      sender: connectedUser._id,
      text: 'Message 2',
      conversation: conv2._id,
    });
    conv2.messages.push(msg2._id);
    await conv2.save();

    const conv3 = await createConversation({
      participants: [connectedUser._id, user3._id],
    });
    const msg3 = await createMessage({
      sender: connectedUser._id,
      text: 'Message 3',
      conversation: conv3._id,
    });
    conv3.messages.push(msg3._id);
    await conv3.save();

    const conv4 = await createConversation({
      participants: [connectedUser._id, user4._id],
    });
    const msg4 = await createMessage({
      sender: connectedUser._id,
      text: 'Message 4',
      conversation: conv4._id,
    });
    conv4.messages.push(msg4._id);
    await conv4.save();

    const res = await request(app)
      .get(`/api/conversations`)
      .auth(connectedUserToken, { type: 'bearer' });

    expect(res.status).toEqual(200);

    const { conversations } = res.body;

    // Vérifier que les conversations sont retournées dans le bon ordre (du plus récent au plus ancien)
    expect(conversations.length).toBe(4);
    expect(conversations[0].lastMessage.text).toBe('Message 4');
    expect(conversations[1].lastMessage.text).toBe('Message 3');
    expect(conversations[2].lastMessage.text).toBe('Message 2');
    expect(conversations[3].lastMessage.text).toBe('Message 1');
  });

  test('should handle conversations without messages', async () => {
    const user1 = await createUser({});
    const connectedUser = await createUser({});
    const connectedUserToken = generateToken(connectedUser._id);

    const conv5 = await createConversation({
      participants: [connectedUser._id, user1._id],
    });

    // Envoyer la requête pour obtenir les conversations
    const res = await request(app)
      .get(`/api/conversations`)
      .auth(connectedUserToken, { type: 'bearer' });

    expect(res.status).toEqual(200);

    const { conversations } = res.body;

    // Vérifier que les conversations sans messages ne sont pas incluses
    const conversationIds = conversations.map((conv) => conv._id.toString());
    expect(conversationIds).not.toContain(conv5._id.toString());
  });

  test('should handle conversations with messages having identical dates', async () => {
    const user2 = await createUser({});
    const user3 = await createUser({});

    const connectedUser = await createUser({});
    const connectedUserToken = generateToken(connectedUser._id);
    const identicalDate = new Date();

    // Créer des conversations avec des messages ayant des dates identiques
    const conv6 = await createConversation({
      participants: [connectedUser._id, user2._id],
    });
    const msg6_1 = await createMessage({
      sender: connectedUser._id,
      text: 'Message 6-1',
      conversation: conv6._id,
      createdAt: identicalDate,
    });
    const msg6_2 = await createMessage({
      sender: user2._id,
      text: 'Message 6-2',
      conversation: conv6._id,
      createdAt: identicalDate,
    });
    conv6.messages.push(msg6_1._id, msg6_2._id);
    await conv6.save();

    const conv7 = await createConversation({
      participants: [connectedUser._id, user3._id],
    });
    const msg7_1 = await createMessage({
      sender: connectedUser._id,
      text: 'Message 7-1',
      conversation: conv7._id,
      createdAt: identicalDate,
    });
    const msg7_2 = await createMessage({
      sender: user3._id,
      text: 'Message 7-2',
      conversation: conv7._id,
      createdAt: identicalDate,
    });
    conv7.messages.push(msg7_1._id, msg7_2._id);
    await conv7.save();

    // Envoyer la requête pour obtenir les conversations
    const res = await request(app)
      .get(`/api/conversations`)
      .auth(connectedUserToken, { type: 'bearer' });

    expect(res.status).toEqual(200);

    const { conversations } = res.body;

    // Vérifier que les conversations sont retournées dans le bon ordre
    // Les conversations avec des messages ayant des dates identiques doivent être présentes
    const conversationIds = conversations.map((conv) => conv._id.toString());
    expect(conversationIds).toContain(conv6._id.toString());
    expect(conversationIds).toContain(conv7._id.toString());
  });

  test('should handle conversations with different numbers of messages', async () => {
    const user1 = await createUser({});
    const user4 = await createUser({});

    const connectedUser = await createUser({});
    const connectedUserToken = generateToken(connectedUser._id);
    const conv8 = await createConversation({
      participants: [connectedUser._id, user4._id],
    });
    const now = new Date();

    const msg8_1 = await createMessage({
      sender: connectedUser._id,
      text: 'Message 8-1',
      conversation: conv8._id,
      createdAt: new Date(now.getTime() - 3000),
    });
    const msg8_2 = await createMessage({
      sender: user4._id,
      text: 'Message 8-2',
      conversation: conv8._id,
      createdAt: new Date(now.getTime() - 2000),
    });
    const msg8_3 = await createMessage({
      sender: connectedUser._id,
      text: 'Message 8-3',
      conversation: conv8._id,
      createdAt: new Date(now.getTime() - 1000),
    });
    conv8.messages.push(msg8_1._id, msg8_2._id, msg8_3._id);
    await conv8.save();

    const conv9 = await createConversation({
      participants: [connectedUser._id, user1._id],
    });
    const msg9_1 = await createMessage({
      sender: connectedUser._id,
      text: 'Message 9-1',
      conversation: conv9._id,
      createdAt: new Date(now.getTime() - 1000),
    });
    conv9.messages.push(msg9_1._id);
    await conv9.save();

    // Envoyer la requête pour obtenir les conversations
    const res = await request(app)
      .get(`/api/conversations`)
      .auth(connectedUserToken, { type: 'bearer' });

    expect(res.status).toEqual(200);

    const { conversations } = res.body;

    // Vérifier que les conversations sont retournées dans le bon ordre
    // Les conversations avec différents nombres de messages doivent être présentes
    const conversationIds = conversations.map((conv) => conv._id.toString());
    expect(conversationIds).toContain(conv8._id.toString());
    expect(conversationIds).toContain(conv9._id.toString());

    // Vérifier l'ordre des conversations
    expect(conversations[0].lastMessage.text).toBe('Message 8-3');
    expect(conversations[1].lastMessage.text).toBe('Message 9-1');
  });
});
