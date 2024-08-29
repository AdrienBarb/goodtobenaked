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
const signUrl = require('../lib/utils/signedUrl');

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
    memberId,
    cursor,
    limit = 16,
    showOnlyFollowedUser,
    state,
    isFree,
    tag,
    enablePagination = 'true',
  } = req.query;

  let filter = {
    isArchived: false,
    visibility: 'public',
  };

  let usersList = [];

  const userConditions = { isAccountVerified: true };

  if (showOnlyFollowedUser === 'true' && req?.user?._id) {
    userConditions.notificationSubscribers = { $in: req.user._id.toString() };
  }

  if (isFree) {
    filter.isFree = isFree === 'free';
  }

  if (state === 'bought' && req?.user?._id) {
    filter.paidMembers = { $in: req.user._id.toString() };
  }

  if (tag) {
    filter.tags = { $in: tag };
  }

  const verifiedUsers = await userModel
    .find(userConditions)
    .select('_id')
    .lean();
  usersList = verifiedUsers.map((user) => user._id);

  filter.user = { $in: usersList };

  if (memberId) {
    filter.paidMembers = memberId;
    delete filter.isArchived;
    delete filter.visibility;
  }

  if (cursor && enablePagination === 'true') {
    filter._id = { $lt: mongoose.Types.ObjectId(cursor) };
  }

  let query = nudeModel.find(filter).sort({ createdAt: -1 });

  if (enablePagination === 'true') {
    query = query.limit(limit);
  }

  const nudes = await query
    .populate('user', 'pseudo profileImage')
    .populate(
      'medias',
      'user mediaType convertedKey blurredKey posterKey status',
    )
    .lean();

  const cloudFrontUrl = process.env.CLOUDFRONT_URL;
  const updatedNudes = nudes.map((nude) => {
    const updatedMedias = nude.medias.map((media) => {
      const isOwnerOrPaidMember =
        req.user?.id &&
        (nude.paidMembers.includes(req.user.id) ||
          nude.user._id.toString() === req.user.id);

      return {
        _id: media._id,
        user: media.user,
        mediaType: media.mediaType,
        blurredKey: media.blurredKey
          ? `${cloudFrontUrl}${media.blurredKey}`
          : null,
        posterKey: media.posterKey
          ? signUrl(`${cloudFrontUrl}${media.posterKey}`)
          : null,
        status: media.status,
        convertedKey:
          (isOwnerOrPaidMember || nude.isFree) && media.convertedKey
            ? signUrl(`${cloudFrontUrl}${media.convertedKey}`)
            : null,
      };
    });

    return {
      ...nude,
      medias: updatedMedias,
    };
  });

  const nextCursor =
    enablePagination === 'true' && updatedNudes.length === limit
      ? updatedNudes[updatedNudes.length - 1]._id
      : null;

  res.status(200).json({
    nudes: updatedNudes,
    nextCursor: enablePagination === 'true' ? nextCursor : null,
  });
});

const getUserNudes = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { tag, isFree, mediaTypes } = req.query;

  let matchStage = {
    isArchived: false,
    visibility: 'public',
    user: mongoose.Types.ObjectId(userId),
  };

  if (tag) {
    matchStage.tags = tag;
  }

  if (isFree !== undefined) {
    matchStage.isFree = isFree === 'true';
  }

  const aggregationPipeline = [
    { $match: matchStage },
    {
      $lookup: {
        from: 'media',
        localField: 'medias',
        foreignField: '_id',
        as: 'mediaDetails',
      },
    },
    {
      $addFields: {
        mediaCount: { $size: '$mediaDetails' },
        videoCount: {
          $size: {
            $filter: {
              input: '$mediaDetails',
              as: 'media',
              cond: { $eq: ['$$media.mediaType', 'video'] },
            },
          },
        },
        photoCount: {
          $size: {
            $filter: {
              input: '$mediaDetails',
              as: 'media',
              cond: { $eq: ['$$media.mediaType', 'image'] },
            },
          },
        },
      },
    },
    ...(mediaTypes === 'photo'
      ? [{ $match: { photoCount: { $gt: 0 }, videoCount: 0 } }]
      : mediaTypes === 'video'
      ? [{ $match: { videoCount: { $gt: 0 }, photoCount: 0 } }]
      : mediaTypes === 'bundle'
      ? [{ $match: { mediaCount: { $gt: 1 } } }]
      : []),
    {
      $facet: {
        nudes: [
          { $sort: { createdAt: -1 } },
          {
            $project: {
              _id: 1,
              user: 1,
              description: 1,
              priceDetails: 1,
              isArchived: 1,
              isFree: 1,
              paidMembers: 1,
              tags: 1,
              medias: 1,
              visibility: 1,
              createdAt: 1,
              updatedAt: 1,
              __v: 1,
              mediaDetails: 1,
            },
          },
        ],
        tagCounts: [
          { $unwind: '$tags' },
          { $sortByCount: '$tags' },
          {
            $project: {
              _id: 0,
              tag: '$_id',
              count: '$count',
            },
          },
        ],
      },
    },
  ];

  let [result] = await nudeModel.aggregate(aggregationPipeline).exec();

  result.nudes = await nudeModel.populate(result.nudes, [
    {
      path: 'medias',
      select: 'user mediaType convertedKey blurredKey posterKey status',
    },
    { path: 'user', select: 'pseudo profileImage' },
  ]);

  const cloudFrontUrl = process.env.CLOUDFRONT_URL;
  const updatedNudes = result.nudes.map((nude) => {
    const updatedMedias = nude.medias.map((media) => {
      const isOwnerOrPaidMember =
        req.user?.id &&
        (nude.paidMembers.includes(req.user.id) ||
          nude.user._id.toString() === req.user.id);

      return {
        _id: media._id,
        user: media.user,
        mediaType: media.mediaType,
        blurredKey: media.blurredKey
          ? `${cloudFrontUrl}${media.blurredKey}`
          : null,
        posterKey: media.posterKey
          ? signUrl(`${cloudFrontUrl}${media.posterKey}`)
          : null,
        status: media.status,
        convertedKey:
          (isOwnerOrPaidMember || nude.isFree) && media.convertedKey
            ? signUrl(`${cloudFrontUrl}${media.convertedKey}`)
            : null,
      };
    });

    return {
      ...nude,
      medias: updatedMedias,
    };
  });

  res.status(200).json({
    nudes: updatedNudes,
    availableFilters: {
      availableTags: result.tagCounts,
    },
  });
});

const getCurrentNude = asyncHandler(async (req, res, next) => {
  const { nudeId } = req.params;

  const nude = await nudeModel
    .findById(nudeId)
    .populate('user', 'pseudo image.profil')
    .populate(
      'medias',
      'user mediaType convertedKey blurredKey posterKey status',
    )
    .lean();

  const cloudFrontUrl = process.env.CLOUDFRONT_URL;

  res.status(200).json({
    ...nude,
    medias: nude.medias.map((media) => {
      const isOwnerOrPaidMember =
        req.user?.id &&
        (nude.paidMembers.includes(req.user.id) ||
          nude.user._id.toString() === req.user.id);

      return {
        _id: media._id,
        user: media.user,
        mediaType: media.mediaType,
        blurredKey: media.blurredKey
          ? `${cloudFrontUrl}${media.blurredKey}`
          : null,
        posterKey: media.posterKey
          ? signUrl(`${cloudFrontUrl}${media.posterKey}`)
          : null,
        status: media.status,
        convertedKey:
          (isOwnerOrPaidMember || nude.isFree) && media.convertedKey
            ? signUrl(`${cloudFrontUrl}${media.convertedKey}`)
            : null,
      };
    }),
  });
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

  const updatedNude = await nudeModel
    .findById(nude._id)
    .populate('user', 'pseudo image.profil')
    .populate(
      'medias',
      'user mediaType convertedKey blurredKey posterKey status',
    )
    .lean();

  const cloudFrontUrl = process.env.CLOUDFRONT_URL;
  res.status(200).json({
    ...updatedNude,
    medias: updatedNude.medias.map((media) => {
      return {
        _id: media._id,
        user: media.user,
        mediaType: media.mediaType,
        blurredKey: media.blurredKey
          ? `${cloudFrontUrl}${media.blurredKey}`
          : null,
        posterKey: media.posterKey
          ? signUrl(`${cloudFrontUrl}${media.posterKey}`)
          : null,
        status: media.status,
        convertedKey: media.convertedKey
          ? signUrl(`${cloudFrontUrl}${media.convertedKey}`)
          : null,
      };
    }),
  });
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
  getUserNudes,
};
