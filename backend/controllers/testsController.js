const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const mediaModel = require('../models/mediaModel');
const nudeModel = require('../models/nudeModel');
const mongoose = require('mongoose');
const conversationModel = require('../models/conversationModel');
const messageModel = require('../models/messageModel');

const createCypressSeed = asyncHandler(async (req, res, next) => {
  const createMember = async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('jesaispas', salt);

    try {
      const member = await userModel.create({
        _id: mongoose.Types.ObjectId('66bf0563f355454d82a7086f'),
        pseudo: 'member',
        email: 'member@gmail.com',
        password: hashedPassword,
        userType: 'member',
      });

      console.log('Member created with success');
    } catch (err) {
      console.error(err);
    }
  };

  const createVerifiedCreator = async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('jesaispas', salt);

    try {
      const verifiedCreator = await userModel.create({
        _id: mongoose.Types.ObjectId('66bf0563f355454d82a70872'),
        pseudo: 'verifiedCreator',
        email: 'verifiedcreator@gmail.com',
        password: hashedPassword,
        userType: 'creator',
        profileImage:
          'profile/6439620f7e4744eed5a74796/ed80416ca39e1428eccdaaab94facc79027dcb796be6931c0a99621677d4bb44.jpg',
        secondaryProfileImages: [
          '65605b78d151b12389f639f8',
          '65605b33d151b12389f639b8',
        ],
        description: 'Hello friends!',
        verified: 'verified',
        isAccountVerified: true,
        emailVerified: true,
      });

      const media = await mediaModel.create({
        user: verifiedCreator,
        mediaType: 'image',
        fileName:
          'ce100ae574e8c81a3dc7e5e785d94e0ce532c4cfbc0b9cead4ef6498007500b2',
        mediaPublicId:
          'ce100ae574e8c81a3dc7e5e785d94e0ce532c4cfbc0b9cead4ef6498007500b2',
        originalKey:
          '6439620f7e4744eed5a74796/images/ce100ae574e8c81a3dc7e5e785d94e0ce532c4cfbc0b9cead4ef6498007500b2.png',
        convertedKey:
          'converted/6439620f7e4744eed5a74796/ce100ae574e8c81a3dc7e5e785d94e0ce532c4cfbc0b9cead4ef6498007500b2.jpg',
        blurredKey:
          'blurred/6439620f7e4744eed5a74796/ce100ae574e8c81a3dc7e5e785d94e0ce532c4cfbc0b9cead4ef6498007500b2.jpg',
        posterKey:
          'poster/6439620f7e4744eed5a74796/ce100ae574e8c81a3dc7e5e785d94e0ce532c4cfbc0b9cead4ef6498007500b2.jpg',
        status: 'ready',
        isArchived: false,
      });

      const nude1 = await nudeModel.create({
        user: verifiedCreator,
        description: 'coucou',
        priceDetails: {
          fiatPrice: 1000,
          creditPrice: 1000,
        },
        isArchived: false,
        isFree: true,
        paidMembers: [],
        medias: [media],
        visibility: 'public',
      });

      const nude2 = await nudeModel.create({
        user: verifiedCreator,
        description: 'coucou',
        priceDetails: {
          fiatPrice: 1000,
          creditPrice: 1000,
        },
        isArchived: false,
        isFree: true,
        paidMembers: [],
        medias: [media],
        visibility: 'public',
      });

      const nude3 = await nudeModel.create({
        user: verifiedCreator,
        description: 'coucou',
        priceDetails: {
          fiatPrice: 1000,
          creditPrice: 1000,
        },
        isArchived: false,
        isFree: true,
        paidMembers: [],
        medias: [media],
        visibility: 'public',
      });

      const nude4 = await nudeModel.create({
        user: verifiedCreator,
        description: 'coucou',
        priceDetails: {
          fiatPrice: 1000,
          creditPrice: 1000,
        },
        isArchived: true,
        isFree: true,
        paidMembers: [],
        medias: [media],
        visibility: 'public',
      });

      const nude5 = await nudeModel.create({
        user: verifiedCreator,
        description: 'coucou',
        priceDetails: {
          fiatPrice: 1000,
          creditPrice: 1000,
        },
        isArchived: true,
        isFree: true,
        paidMembers: [],
        medias: [media],
        visibility: 'private',
      });

      console.log('verifiedCreator created with success');
    } catch (err) {
      console.error(err);
    }
  };

  const createUnverifiedCreator = async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('jesaispas', salt);

    try {
      const unverifiedCreator = await userModel.create({
        _id: mongoose.Types.ObjectId('66bf0564f355454d82a70887'),
        pseudo: 'unverifiedCreator',
        email: 'unverifiedcreator@gmail.com',
        password: hashedPassword,
        userType: 'creator',
        profileImage:
          'profile/6439620f7e4744eed5a74796/ed80416ca39e1428eccdaaab94facc79027dcb796be6931c0a99621677d4bb44.jpg',
        secondaryProfileImages: [
          '65605b78d151b12389f639f8',
          '65605b33d151b12389f639b8',
        ],
        description: 'Hello friends!',
        verified: 'unverified',
        isAccountVerified: false,
        emailVerified: false,
      });

      const media = await mediaModel.create({
        user: unverifiedCreator,
        mediaType: 'image',
        fileName:
          'ce100ae574e8c81a3dc7e5e785d94e0ce532c4cfbc0b9cead4ef6498007500b2',
        mediaPublicId:
          'ce100ae574e8c81a3dc7e5e785d94e0ce532c4cfbc0b9cead4ef6498007500b2',
        originalKey:
          '6439620f7e4744eed5a74796/images/ce100ae574e8c81a3dc7e5e785d94e0ce532c4cfbc0b9cead4ef6498007500b2.png',
        convertedKey:
          'converted/6439620f7e4744eed5a74796/ce100ae574e8c81a3dc7e5e785d94e0ce532c4cfbc0b9cead4ef6498007500b2.jpg',
        blurredKey:
          'blurred/6439620f7e4744eed5a74796/ce100ae574e8c81a3dc7e5e785d94e0ce532c4cfbc0b9cead4ef6498007500b2.jpg',
        posterKey:
          'poster/6439620f7e4744eed5a74796/ce100ae574e8c81a3dc7e5e785d94e0ce532c4cfbc0b9cead4ef6498007500b2.jpg',
        status: 'ready',
        isArchived: false,
      });

      const nude1 = await nudeModel.create({
        user: unverifiedCreator,
        description: 'coucou',
        priceDetails: {
          fiatPrice: 1000,
          creditPrice: 1000,
        },
        isArchived: false,
        isFree: true,
        paidMembers: [],
        medias: [media],
        visibility: 'public',
      });

      const nude2 = await nudeModel.create({
        user: unverifiedCreator,
        description: 'coucou',
        priceDetails: {
          fiatPrice: 1000,
          creditPrice: 1000,
        },
        isArchived: false,
        isFree: true,
        paidMembers: [],
        medias: [media],
        visibility: 'public',
      });

      const nude3 = await nudeModel.create({
        user: unverifiedCreator,
        description: 'coucou',
        priceDetails: {
          fiatPrice: 1000,
          creditPrice: 1000,
        },
        isArchived: false,
        isFree: true,
        paidMembers: [],
        medias: [media],
        visibility: 'public',
      });

      const nude4 = await nudeModel.create({
        user: unverifiedCreator,
        description: 'coucou',
        priceDetails: {
          fiatPrice: 1000,
          creditPrice: 1000,
        },
        isArchived: true,
        isFree: true,
        paidMembers: [],
        medias: [media],
        visibility: 'public',
      });

      const nude5 = await nudeModel.create({
        user: unverifiedCreator,
        description: 'coucou',
        priceDetails: {
          fiatPrice: 1000,
          creditPrice: 1000,
        },
        isArchived: true,
        isFree: true,
        paidMembers: [],
        medias: [media],
        visibility: 'private',
      });

      console.log('verifiedCreator created with success');
    } catch (err) {
      console.error(err);
    }
  };

  await createMember();
  await createVerifiedCreator();
  await createUnverifiedCreator();

  res.status(200).json();
});

const deleteCypressSeed = asyncHandler(async (req, res, next) => {
  const userIds = [
    '66bf0563f355454d82a7086f', // member
    '66bf0563f355454d82a70872', // verifiedCreator
    '66bf0564f355454d82a70887', // unverifiedCreator
  ];

  await nudeModel.deleteMany({ user: { $in: userIds } });

  await mediaModel.deleteMany({ user: { $in: userIds } });

  await userModel.deleteMany({ _id: { $in: userIds } });

  await conversationModel.deleteMany({ participants: { $in: userIds } });
  await messageModel.deleteMany({ sender: { $in: userIds } });

  res.status(200).json();
});

module.exports = {
  createCypressSeed,
  deleteCypressSeed,
};
