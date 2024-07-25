const asyncHandler = require('express-async-handler');
const nudeModel = require('../models/nudeModel');
const CustomError = require('../lib/error/CustomError');
const { getMediaPrice } = require('../lib/utils/price');
const { default: mongoose } = require('mongoose');
const { executeInTransaction } = require('../db');
const { notifySlack } = require('../lib/services/slack');
const userModel = require('../models/userModel');
const saleModel = require('../models/saleModel');
const { errorMessages } = require('../lib/constants');
const conversationModel = require('../models/conversationModel');
const messageModel = require('../models/messageModel');

const createNude = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);
  const { selectedMedias, description, isFree, price, visibility, tags } =
    req.body;

  if (
    (visibility === 'public' && !description) ||
    selectedMedias.length === 0
  ) {
    return next(new CustomError(400, errorMessages.MISSING_FIELDS));
  }

  if (!isFree && !price) {
    return next(new CustomError(400, errorMessages.MISSING_FIELDS));
  }

  const nudeObject = {
    user: user._id,
    description: description,
    medias: selectedMedias,
    isFree: isFree,
    visibility: visibility,
    tags: tags,
    priceDetails: {},
  };

  const { fiatPrice, creditPrice } = getMediaPrice(price);

  nudeObject.priceDetails.fiatPrice = fiatPrice;
  nudeObject.priceDetails.creditPrice = creditPrice;

  const createdNude = await nudeModel.create(nudeObject);

  const nude = await nudeModel.findById(createdNude._id).populate('medias');

  res.status(201).json(nude);
});

const getAllNudes = asyncHandler(async (req, res, next) => {
  const {
    userId,
    memberId,
    cursor,
    limit = 16,
    showOnlyFollowedUser,
    state,
    isFree,
    tag,
  } = req.query;

  let filter = {
    isArchived: false,
    visibility: 'public',
  };

  const verifiedUsers = await userModel.find({
    isAccountVerified: true,
  });

  let usersList = verifiedUsers.map((user) => user._id);

  if (
    showOnlyFollowedUser &&
    showOnlyFollowedUser === 'true' &&
    req?.user?._id
  ) {
    const peoplesUserFollow = await userModel.find({
      notificationSubscribers: { $in: req.user._id.toString() },
      isAccountVerified: true,
    });

    const peoplesUserFollowIds = peoplesUserFollow.map((user) => user._id);

    usersList = peoplesUserFollowIds;
  }

  filter.user = { $in: usersList };

  if (isFree) {
    filter.isFree = isFree === 'free';
  }

  if (state && state === 'bought' && req?.user?._id) {
    filter.paidMembers = { $in: req.user._id.toString() };
  }

  if (tag) {
    filter.tags = { $in: tag };
  }

  if (userId) {
    filter.user = mongoose.Types.ObjectId(userId);
  }

  if (memberId) {
    filter.paidMembers = memberId;
    delete filter.isArchived;
    delete filter.visibility;
  }

  if (cursor) {
    filter._id = { $lt: mongoose.Types.ObjectId(cursor) };
  }

  const nudes = await nudeModel
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'pseudo image.profil')
    .populate('medias')
    .lean();

  const nextCursor =
    nudes.length === limit ? nudes[nudes.length - 1]._id : null;

  res.status(200).json({
    nudes,
    nextCursor,
  });
});

const getCurrentNude = asyncHandler(async (req, res, next) => {
  const { nudeId } = req.params;

  const nude = await nudeModel
    .findById(nudeId)
    .populate('user')
    .populate('medias');

  res.status(200).json(nude);
});

const editNude = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);
  const { nudeId } = req.params;

  const { description, isFree, price, tags } = req.body;

  if (!description) {
    return next(new CustomError(400, errorMessages.MISSING_FIELDS));
  }

  if (!isFree && !price) {
    return next(new CustomError(400, errorMessages.MISSING_FIELDS));
  }

  const nude = await nudeModel.findById(nudeId);

  if (!nude) {
    return next(new CustomError(404, errorMessages.NOT_FOUND));
  }

  if (!nude.user.equals(user._id)) {
    return next(new CustomError(400, errorMessages.NOT_AUTHORIZED));
  }

  if (nude.visibility === 'private') {
    return next(new CustomError(400, errorMessages.NOT_AUTHORIZED));
  }

  nude.description = description;
  nude.isFree = isFree;
  nude.tags = tags;

  const { fiatPrice, creditPrice } = getMediaPrice(price);

  nude.priceDetails.fiatPrice = fiatPrice;
  nude.priceDetails.creditPrice = creditPrice;

  await nude.save();

  res.status(200).json(nude);
});

const archivedNude = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);
  const { nudeId } = req.params;

  const nude = await nudeModel.findById(nudeId);

  if (!nude) {
    return next(new CustomError(404, errorMessages.NOT_FOUND));
  }

  if (!nude.user.equals(user?._id)) {
    return next(new CustomError(400, errorMessages.NOT_AUTHORIZED));
  }

  if (nude.visibility === 'private') {
    return next(new CustomError(400, errorMessages.NOT_AUTHORIZED));
  }

  nude.isArchived = true;

  await nude.save();

  res.status(200).json(nude);
});

const buyNude = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);
  const { nudeId } = req.body;

  const nude = await nudeModel.findById(nudeId).populate('user');

  if (!nude) {
    return next(new CustomError(404, 'not_found'));
  }

  if (user.creditAmount < nude.priceDetails.creditPrice) {
    return next(new CustomError(400, 'not_enough_credit'));
  }

  await executeInTransaction(async (session) => {
    //Add buyer to paidMembers of the nude
    await nudeModel.updateOne(
      { _id: nude?._id },
      {
        $push: { paidMembers: user._id.toString() },
      },
      { session },
    );

    //Remove credit from the buyer
    const newMemberCreditAmount =
      user.creditAmount - nude.priceDetails.creditPrice;

    await userModel.updateOne(
      { _id: user._id },
      {
        creditAmount: newMemberCreditAmount,
      },
      { session },
    );

    //Create a sale
    await saleModel.create(
      [
        {
          owner: nude.user,
          fromUser: user._id,
          saleType: 'nude',
          nude: nude,
          amount: {
            fiatValue: nude.priceDetails.fiatPrice,
            creditValue: nude.priceDetails.creditPrice,
            currency: nude.priceDetails.currency,
          },
        },
      ],
      { session },
    );

    //Add userId in nudeBuyers array of the nude owner
    const owner = await userModel.findById(nude.user);
    const userId = user._id.toString();
    if (!owner.nudeBuyers.includes(userId)) {
      owner.nudeBuyers = [...owner.nudeBuyers, userId];
    }
    await owner.save({ session });
  });

  await notifySlack('Une vente de nude');

  res.status(200).json('Succeed');
});

const createPush = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);
  const { selectedMedias, message, isFree, price, usersList } = req.body;

  if (!message || selectedMedias.length === 0) {
    return next(new CustomError(400, errorMessages.MISSING_FIELDS));
  }

  if (!isFree && !price) {
    return next(new CustomError(400, errorMessages.MISSING_FIELDS));
  }

  // Récupérer les IDs des listes d'utilisateurs sélectionnées
  let userIds = [];

  if (usersList.includes('notificationSubscribers')) {
    userIds = userIds.concat(user.notificationSubscribers);
  }
  if (usersList.includes('profileViewers')) {
    userIds = userIds.concat(user.profileViewers);
  }
  if (usersList.includes('messageSenders')) {
    userIds = userIds.concat(user.messageSenders);
  }
  if (usersList.includes('nudeBuyers')) {
    userIds = userIds.concat(user.nudeBuyers);
  }

  // Éliminer les doublons
  userIds = [...new Set(userIds)];

  // Filtrer les utilisateurs de type 'member'
  const members = await userModel.find({
    _id: { $in: userIds },
    userType: 'member',
  });

  const memberIds = members.map((member) => member._id);

  const nudeObject = {
    user: user._id,
    medias: selectedMedias,
    isFree: isFree,
    visibility: 'private',
    priceDetails: {},
  };

  const { fiatPrice, creditPrice } = getMediaPrice(price);

  nudeObject.priceDetails.fiatPrice = fiatPrice;
  nudeObject.priceDetails.creditPrice = creditPrice;

  const createdNude = await nudeModel.create(nudeObject);

  // Envoyer le "Nude" à chaque utilisateur
  for (const memberId of memberIds) {
    let conversation = await conversationModel.findOne({
      participants: { $all: [user._id, memberId] },
    });

    if (!conversation) {
      conversation = await conversationModel.create({
        participants: [user._id, memberId],
      });
    }

    // Envoyer le message avec le "Nude"
    const messageValues = {
      sender: user._id,
      nude: createdNude._id,
      text: message,
      conversation: conversation,
    };

    const createdMessage = await messageModel.create(messageValues);

    await conversationModel.updateOne(
      { _id: conversation._id },
      { $push: { messages: createdMessage._id } },
    );
  }

  res.status(201).json(createdNude);
});

module.exports = {
  createNude,
  getAllNudes,
  getCurrentNude,
  editNude,
  archivedNude,
  buyNude,
  createPush,
};
