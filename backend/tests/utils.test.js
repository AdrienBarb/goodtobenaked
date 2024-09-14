const mongoose = require('mongoose');
const createUser = require('./factory/userFactory');
const { MongoMemoryReplSet } = require('mongodb-memory-server');
const createSale = require('./factory/saleFactory');
const calculateCurrentBalanceWithCommission = require('../lib/utils/calculateCurrentBalanceWithCommission');
const moment = require('moment');
const getNudePermissions = require('../lib/utils/getNudePermissions');
const checkIsOwner = require('../lib/utils/checkIsOwner');

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

describe('getNudePermissions', () => {
  let nude, userId, ownerId;

  beforeEach(() => {
    userId = new mongoose.Types.ObjectId().toString();
    ownerId = new mongoose.Types.ObjectId();

    nude = {
      user: { _id: ownerId },
      isFree: false,
      paidMembers: [],
    };
  });

  test('should allow owner to edit and view but not buy', () => {
    const permissions = getNudePermissions(nude, ownerId);

    expect(permissions.canEdit).toBe(true);
    expect(permissions.canView).toBe(true);
    expect(permissions.canBuy).toBe(false);
  });

  test('should allow non-owner to buy but not view or edit if not paid and not free', () => {
    const permissions = getNudePermissions(nude, userId);

    expect(permissions.canEdit).toBe(false);
    expect(permissions.canView).toBe(false);
    expect(permissions.canBuy).toBe(true);
  });

  test('should allow non-owner to view but not buy or edit if user has paid', () => {
    nude.paidMembers.push(userId);

    const permissions = getNudePermissions(nude, userId);

    expect(permissions.canEdit).toBe(false);
    expect(permissions.canView).toBe(true);
    expect(permissions.canBuy).toBe(false);
  });

  test('should allow everyone to view but not buy or edit if nude is free', () => {
    nude.isFree = true;

    const permissions = getNudePermissions(nude, userId);

    expect(permissions.canEdit).toBe(false);
    expect(permissions.canView).toBe(true);
    expect(permissions.canBuy).toBe(false);
  });

  test('should not allow paid members to buy again', () => {
    nude.paidMembers.push(userId.toString());

    const permissions = getNudePermissions(nude, userId);

    expect(permissions.canBuy).toBe(false);
  });

  test('should allow non-paid user to buy if not owner and nude is not free', () => {
    const permissions = getNudePermissions(nude, userId);

    expect(permissions.canBuy).toBe(true);
  });
});

describe('checkIsOwner', () => {
  let ownerId, userId;

  beforeEach(() => {
    ownerId = new mongoose.Types.ObjectId();
    userId = new mongoose.Types.ObjectId();
  });

  test('should return true when ownerId and userId are the same (ObjectId)', () => {
    const result = checkIsOwner(ownerId, ownerId);
    expect(result).toBe(true);
  });

  test('should return false when ownerId and userId are different (ObjectId)', () => {
    const result = checkIsOwner(ownerId, userId);
    expect(result).toBe(false);
  });

  test('should return true when ownerId and userId are the same (string)', () => {
    const ownerIdString = ownerId.toString();
    const result = checkIsOwner(ownerIdString, ownerIdString);
    expect(result).toBe(true);
  });

  test('should return false when ownerId and userId are different (string)', () => {
    const ownerIdString = ownerId.toString();
    const userIdString = userId.toString();
    const result = checkIsOwner(ownerIdString, userIdString);
    expect(result).toBe(false);
  });

  test('should return true when ownerId is ObjectId and userId is string but they match', () => {
    const userIdString = userId.toString();
    const result = checkIsOwner(userId, userIdString);
    expect(result).toBe(true);
  });

  test('should return false when ownerId is ObjectId and userId is string but they do not match', () => {
    const ownerIdString = ownerId.toString();
    const result = checkIsOwner(ownerId, userId.toString());
    expect(result).toBe(false);
  });

  test('should return false for invalid ObjectId or userId', () => {
    const invalidId = 'invalid_id';
    const result = checkIsOwner(ownerId, invalidId);
    expect(result).toBe(false);
  });

  test('should return false if one of the ids is null or undefined', () => {
    const result1 = checkIsOwner(ownerId, null);
    const result2 = checkIsOwner(undefined, userId);
    expect(result1).toBe(false);
    expect(result2).toBe(false);
  });
});
