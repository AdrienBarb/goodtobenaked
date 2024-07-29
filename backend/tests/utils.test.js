const mongoose = require('mongoose');
const createUser = require('./factory/userFactory');
const { MongoMemoryReplSet } = require('mongodb-memory-server');
const createSale = require('./factory/saleFactory');
const calculateCurrentBalanceWithCommission = require('../lib/utils/calculateCurrentBalanceWithCommission');
const moment = require('moment');

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

describe('calculateCurrentBalanceWithCommission', () => {
  test('should correctly calculate the current balance with commission for users in promotion period', async () => {
    const user = await createUser({
      promotionEndDate: moment().add(1, 'months').toDate(),
    });

    await createSale({
      owner: user,
      amount: { fiatValue: 600, creditValue: 600 },
      isPaid: false,
      availableDate: moment().subtract(1, 'days').toDate(),
    });

    await createSale({
      owner: user,
      amount: { fiatValue: 500, creditValue: 500 },
      isPaid: false,
      availableDate: moment().add(1, 'days').toDate(),
    });

    const { available, pending } = await calculateCurrentBalanceWithCommission(
      user,
    );

    expect(available).toEqual(600);
    expect(pending).toEqual(500);
  });

  test('should correctly calculate the current balance with commission for users outside promotion period', async () => {
    const user = await createUser({
      promotionEndDate: moment().subtract(1, 'months').toDate(),
    });

    await createSale({
      owner: user,
      amount: { fiatValue: 600, creditValue: 600 },
      isPaid: false,
      availableDate: moment().subtract(1, 'days').toDate(),
    });

    await createSale({
      owner: user,
      amount: { fiatValue: 500, creditValue: 500 },
      isPaid: false,
      availableDate: moment().add(1, 'days').toDate(),
    });

    const { available, pending } = await calculateCurrentBalanceWithCommission(
      user,
    );

    expect(available).toEqual(480);
    expect(pending).toEqual(400);
  });

  test('should return 0 if no sales are provided', async () => {
    const user = await createUser({
      promotionEndDate: moment().subtract(1, 'months').toDate(),
    });

    const { available, pending } = await calculateCurrentBalanceWithCommission(
      user,
    );
    expect(available).toEqual(0);
    expect(pending).toEqual(0);
  });
});
