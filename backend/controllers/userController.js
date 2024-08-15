const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const userModel = require('../models/userModel');
const { subscribeToMailchimp } = require('../lib/services/mailchimp');
const CustomError = require('../lib/error/CustomError');
const { executeInTransaction } = require('../db');
const { errorMessages } = require('../lib/constants');
const userTokenModel = require('../models/userTokenModel');
const crypto = require('crypto');
const emailService = require('../lib/email');
const profileVisitModel = require('../models/profileVisitModel');
const notificationModel = require('../models/notificationModel');
const { notifySlack } = require('../lib/services/slack');
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require('@aws-sdk/client-s3');
const sharp = require('sharp');
const creatorIdentityVerificationModel = require('../models/creatorIdentityVerificationModel');
const nudeModel = require('../models/nudeModel');
const conversationModel = require('../models/conversationModel');
const { getPriceInFiatFromCredits } = require('../lib/utils/price');
const saleModel = require('../models/saleModel');
const config = require('../config');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const signUrl = require('../lib/utils/signedUrl');

const register = asyncHandler(async (req, res, next) => {
  const { pseudo, email, password } = req.body;

  if (!pseudo || !email || !password) {
    return next(new CustomError(400, errorMessages.MISSING_FIELDS));
  }

  const lowerCaseEmail = email.toLowerCase();

  const userExists = await userModel.findOne({ email: lowerCaseEmail });

  if (userExists) {
    return next(new CustomError(400, errorMessages.USER_ALREADY_EXIST));
  }

  const pseudoExist = await userModel.findOne({ pseudo });

  if (pseudoExist) {
    return next(new CustomError(400, errorMessages.PSEUDO_ALREADY_EXIST));
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  let user;

  await executeInTransaction(async (session) => {
    user = new userModel(
      {
        pseudo,
        email: lowerCaseEmail,
        password: hashedPassword,
      },
      { session },
    );

    await user.save({ session });
  });

  if (!user) {
    return next(new CustomError(400, errorMessages.SOMETHING_HAPPENED));
  }

  res.status(201).json({
    _id: user._id,
    pseudo: user.pseudo,
    isAccountVerified: user.isAccountVerified,
    userType: user.userType,
    isAmbassador: user.isAmbassador,
    salesFee: user.salesFee,
    creditAmount: user.creditAmount,
    token: generateToken(user.id),
  });
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const lowerCaseEmail = email.toLowerCase();

  const user = await userModel.findOne({ email: lowerCaseEmail });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      pseudo: user.pseudo,
      email: user.email,
      isAccountVerified: user.isAccountVerified,
      userType: user.userType,
      isAmbassador: user.isAmbassador,
      salesFee: user.salesFee,
      creditAmount: user.creditAmount,
      accessToken: generateToken(user.id),
    });
  } else {
    return next(new CustomError(401, errorMessages.CREDENTIALS));
  }
});

const resetPasswordRequest = asyncHandler(async (req, res, next) => {
  const { email, locale } = req.body;

  if (!email) {
    return next(new CustomError(400, errorMessages.MISSING_FIELDS));
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    return next(new CustomError(400, errorMessages.NOT_FOUND));
  }

  let userToken = await userTokenModel.findOne({ user: user._id });

  if (!userToken) {
    userToken = await userTokenModel.create({
      user: user._id,
      token: crypto.randomBytes(32).toString('hex'),
    });
  }

  const link = `${config.clientUrl}/${locale}/login/password-reset/${user._id}/${userToken.token}`;
  emailService.sendResetPasswordEmail(user.email, link);

  res.status(200).json('ok');
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const { password, userId, token } = req.body;

  if (!password || !userId || !token) {
    return next(new CustomError(400, errorMessages.MISSING_FIELDS));
  }

  const user = await userModel.findById(userId);

  if (!user) {
    return next(new CustomError(400, errorMessages.INVALID_LINK));
  }

  const userToken = await userTokenModel.findOne({
    user: user._id,
    token: token,
  });

  if (!userToken) {
    return next(new CustomError(400, errorMessages.INVALID_LINK));
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await executeInTransaction(async (session) => {
    await userModel.updateOne(
      { _id: user._id },
      { password: hashedPassword },
      { session },
    );

    await userTokenModel.deleteOne({ _id: userToken._id }, { session });
  });

  res.status(200).send('ok');
});

const getUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId;

  const user = await userModel
    .findById(userId)
    .select(
      'pseudo profileImage secondaryProfileImages verified version isAmbassador lastLogin description notificationSubscribers socialMediaLink country nationality isAccountVerified isArchived',
    )
    .populate('gender')
    .populate('secondaryProfileImages')
    .lean();

  if (!user) {
    return next(new CustomError(404, errorMessages.NOT_FOUND));
  }

  res.status(200).json({
    ...user,
    secondaryProfileImages:
      user.secondaryProfileImages.map((currentMedia) => {
        return {
          ...currentMedia,
          posterKey: signUrl(
            `${process.env.CLOUDFRONT_URL}${currentMedia.posterKey}`,
          ),
          convertedKey: signUrl(
            `${process.env.CLOUDFRONT_URL}${currentMedia.convertedKey}`,
          ),
        };
      }) || [],
  });
});

const getAccountOwner = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const user = await userModel
    .findById(userId)
    .select(
      'pseudo email profileImage secondaryProfileImages version isAmbassador address salesFee country verified lastLogin description notificationSubscribers profileViewers messageSenders nudeBuyers socialMediaLink nationality breastSize buttSize bodyType hairColor age bankAccount emailNotification inappNotification',
    )
    .populate('gender')
    .populate('secondaryProfileImages')
    .lean();

  if (!user) {
    return next(new CustomError(404, errorMessages.NOT_FOUND));
  }

  res.status(200).json({
    ...user,
    secondaryProfileImages:
      user.secondaryProfileImages.map((currentMedia) => {
        return {
          ...currentMedia,
          posterKey: signUrl(
            `${process.env.CLOUDFRONT_URL}${currentMedia.posterKey}`,
          ),
        };
      }) || [],
  });
});

const userProfile = asyncHandler(async (req, res, next) => {
  let user = await userModel.findById(req.user.id);
  const values = req.body;

  if (!user) {
    return next(new CustomError(404, 'Not found'));
  }

  if (!values.pseudo) {
    return next(new CustomError(400, 'Missing pseudo'));
  }

  const pseudoExist = await userModel.findOne({ pseudo: values.pseudo });

  if (pseudoExist && !pseudoExist._id.equals(user?._id)) {
    return next(new CustomError(400, 'Pseudo already exist'));
  }

  console.log('values.secondaryProfileImages ', values.secondaryProfileImages);

  user.pseudo = values.pseudo ? values.pseudo : user.pseudo;
  user.description = values.description;

  if (values.secondaryProfileImages) {
    console.log('je passe la ');

    user.secondaryProfileImages = values.secondaryProfileImages;
  }

  if (values.age) {
    user.age = parseInt(values.age, 10);
  }

  if (values.gender) {
    user.gender = values.gender;
  }

  if (values.breastSize) {
    user.breastSize = values.breastSize;
  }

  if (values.buttSize) {
    user.buttSize = values.buttSize;
  }

  if (values.bodyType) {
    user.bodyType = values.bodyType;
  }

  if (values.hairColor) {
    user.hairColor = values.hairColor;
  }

  if (values.country) {
    user.country = values.country;
  }

  await user.save();

  res.status(200).json('ok');
});

const profileVisit = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;

  const visitor = await userModel.findById(req.user.id);
  const visitedUser = await userModel.findById(userId);

  if (!visitor || !visitedUser) {
    return;
  }

  if (visitor._id.equals(visitedUser._id)) {
    return;
  }

  await executeInTransaction(async (session) => {
    const visitorId = visitor._id.toString();

    if (!visitedUser.profileViewers.includes(visitorId)) {
      visitedUser.profileViewers = [...visitedUser.profileViewers, visitorId];
    }

    await visitedUser.save({ session });

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingNotification = await notificationModel.findOne({
      fromUser: visitor,
      targetUser: visitedUser,
      type: 'profile_viewed',
      createdAt: { $gte: oneDayAgo },
    });

    if (!existingNotification) {
      await notificationModel.create(
        [
          {
            fromUser: visitor,
            targetUser: visitedUser,
            type: 'profile_viewed',
          },
        ],
        { session },
      );
    }
  });

  res.status(200).json('success');
});

const addProfilPicture = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id).lean();

  const { filetype } = req.body;

  if (!user) {
    return next(new CustomError(404, 'Not found'));
  }

  const s3 = new S3Client({
    credentials: {
      accessKeyId: config.awsAccessKeyId,
      secretAccessKey: config.awsSecretAccessKey,
    },
    region: config.awsRegion,
  });

  let fileExtension;

  switch (filetype) {
    case 'image/jpeg':
      fileExtension = 'jpg';
      break;
    case 'image/png':
      fileExtension = 'png';
      break;
    case 'image/webp':
      fileExtension = 'webp';
      break;
    default:
      return next(new CustomError(400, errorMessages.INVALID_FILE));
  }

  let imageToken = crypto.randomBytes(32).toString('hex');
  const imageKey = `profile/${user._id}/${imageToken}.${fileExtension}`;
  await userModel.updateOne({ _id: user._id }, { profileImage: imageKey });

  let command = new PutObjectCommand({
    Bucket: config.s3BucketProcessedMedia,
    Key: imageKey,
    ContentType: filetype,
  });

  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

  res.status(200).json({
    signedUrl,
    profileImageUrl: imageKey,
  });
});

const getAllUsers = asyncHandler(async (req, res, next) => {
  const query = req.query;
  const aggregateQuery = [];

  const matchQuery = {
    isAccountVerified: true,
    isArchived: false,
    profileImage: { $ne: '' },
  };

  const ageMap = {
    '18-22': { $gte: 18, $lte: 22 },
    '22-30': { $gte: 22, $lte: 30 },
    '30-40': { $gte: 30, $lte: 40 },
    '40+': { $gte: 40 },
  };

  if (query.age && ageMap[query.age]) {
    matchQuery.age = ageMap[query.age];
  }

  const filtersMap = {
    bodyType: () => ({ bodyType: query.bodyType }),
    hairColor: () => ({ hairColor: query.hairColor }),
  };

  for (const [key, generator] of Object.entries(filtersMap)) {
    if (query[key]) {
      Object.assign(matchQuery, await generator());
    }
  }

  aggregateQuery.push({ $match: matchQuery });

  aggregateQuery.push({ $sort: { lastLogin: -1 } });

  const cursor = query.cursor ? new Date(query.cursor) : new Date();

  aggregateQuery.push({ $match: { lastLogin: { $lt: cursor } } });

  aggregateQuery.push({ $limit: 12 });

  aggregateQuery.push({
    $lookup: {
      from: 'media', // La collection de référence (nom exact dans la DB)
      localField: 'secondaryProfileImages', // Champ dans le document User
      foreignField: '_id', // Champ dans la collection Media
      as: 'secondaryProfileImages', // Nom du champ dans le résultat
    },
  });

  aggregateQuery.push({
    $project: {
      pseudo: 1,
      profileImage: 1,
      verified: 1,
      isHighlighted: 1,
      lastLogin: 1,
      secondaryProfileImages: {
        $map: {
          input: '$secondaryProfileImages',
          as: 'image',
          in: {
            _id: '$$image._id',
            convertedKey: '$$image.convertedKey',
          },
        },
      },
    },
  });

  let users = await userModel.aggregate(aggregateQuery);

  // Transformation pour signer les URLs
  users = users.map((user) => ({
    ...user,
    profileImage: user.profileImage
      ? `${process.env.CLOUDFRONT_URL}${user.profileImage}`
      : '',
    secondaryProfileImages:
      user.secondaryProfileImages.map((currentMedia) => {
        return {
          ...currentMedia,
          convertedKey: signUrl(
            `${process.env.CLOUDFRONT_URL}${currentMedia.convertedKey}`,
          ),
        };
      }) || [],
  }));

  const nextCursor =
    users.length > 0 ? users[users.length - 1].lastLogin.toISOString() : null;

  res.status(200).json({
    users,
    nextCursor,
  });
});

const refreshCreditAmount = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);

  res.status(200).json(user.creditAmount);
});

const notificationSubscribe = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);
  const { userId } = req.body;

  if (!userId) {
    return next(new CustomError(400, errorMessages.MISSING_FIELDS));
  }

  const subscriber = await userModel.findById(userId);

  if (!subscriber) {
    return next(new CustomError(404, errorMessages.NOT_FOUND));
  }

  const followerId = user._id.toString();

  if (subscriber.notificationSubscribers.includes(followerId)) {
    subscriber.notificationSubscribers = [
      ...subscriber.notificationSubscribers.filter((id) => id !== followerId),
    ];
  } else {
    subscriber.notificationSubscribers = [
      ...subscriber.notificationSubscribers,
      followerId,
    ];
  }

  await subscriber.save();

  res.status(200).json(subscriber.notificationSubscribers);
});

const checkIfUserVerified = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);

  if (!user) {
    return next(new CustomError(404, errorMessages.NOT_FOUND));
  }

  const isEmailVerified = user.emailVerified;
  const isIdentityVerified = user.verified === 'verified';
  const isProfileCompleted = Boolean(user.profileImage);
  const isBankAccountCompleted = Boolean(
    user.bankAccount?.iban &&
      user.bankAccount?.name &&
      user.bankAccount?.address?.country,
  );
  const nudes = await nudeModel.find({ user: user, isArchived: false });

  if (
    isEmailVerified &&
    isIdentityVerified &&
    isProfileCompleted &&
    isBankAccountCompleted &&
    nudes.length >= 3
  ) {
    user.isAccountVerified = true;
    user.save();
  }

  res.status(200).json({
    isAccountVerified: user.isAccountVerified,
  });
});

const getVerificationStep = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);

  if (!user) {
    return next(new CustomError(404, errorMessages.NOT_FOUND));
  }

  const isEmailVerified = user.emailVerified;
  const isIdentityVerified = user.verified === 'verified';
  const isProfileCompleted = Boolean(user.profileImage);
  const isBankAccountCompleted = Boolean(
    user.bankAccount?.iban &&
      user.bankAccount?.name &&
      user.bankAccount?.address?.country,
  );
  const nudes = await nudeModel.find({ user: user, isArchived: false });

  res.status(200).json({
    isEmailVerified,
    isIdentityVerified,
    isProfileCompleted,
    isBankAccountCompleted,
    isNudesPosted: nudes.length >= 3,
  });
});

const identityVerification = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const { frontIdentity, backIdentity, frontAndFaceIdentity } = req.body;

  if (!frontIdentity || !backIdentity || !frontAndFaceIdentity) {
    return next(new CustomError(400, errorMessages.MISSING_FIELDS));
  }

  try {
    await executeInTransaction(async (session) => {
      await creatorIdentityVerificationModel.create(
        [
          {
            userId: user._id,
            frontIdentityImageName: frontIdentity,
            backIdentityImageName: backIdentity,
            frontAndFaceIdentityImageName: frontAndFaceIdentity,
          },
        ],
        { session },
      );

      user.verified = 'pending';
      await user.save({ session });
    });

    await notifySlack('Une demande de verification');

    res.status(201).json({ verified: user.verified });
  } catch (error) {
    return next(
      new CustomError(500, 'An error occured during image upload', error.stack),
    );
  }
});

const getIdentityVerificationUrl = asyncHandler(async (req, res, next) => {
  const user = req.user;

  const s3 = new S3Client({
    credentials: {
      accessKeyId: config.awsAccessKeyId,
      secretAccessKey: config.awsSecretAccessKey,
    },
    region: config.awsRegion,
  });

  const generateSignedUrl = async (path) => {
    const command = new PutObjectCommand({
      Bucket: config.s3BucketProcessedMedia,
      Key: path,
      ContentType: 'image/jpeg',
    });
    return await getSignedUrl(s3, command, { expiresIn: 3600 });
  };

  const frontIdentityPath = `identity/${user._id.toString()}/frontIdentity.jpg`;
  const backIdentityPath = `identity/${user._id.toString()}/backIdentity.jpg`;
  const frontAndFaceIdentityPath = `identity/${user._id.toString()}/frontAndFaceIdentity.jpg`;

  const frontIdentityUrl = await generateSignedUrl(frontIdentityPath);
  const backIdentityUrl = await generateSignedUrl(backIdentityPath);
  const frontAndFaceIdentityUrl = await generateSignedUrl(
    frontAndFaceIdentityPath,
  );

  res.status(200).json({
    signedUrls: {
      frontIdentityUrl,
      backIdentityUrl,
      frontAndFaceIdentityUrl,
    },
    keys: {
      frontIdentity: frontIdentityPath,
      backIdentity: backIdentityPath,
      frontAndFaceIdentity: frontAndFaceIdentityPath,
    },
  });
});

const editEmail = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findById(req.user.id);

  if (!(await bcrypt.compare(password, user.password))) {
    return next(new CustomError(400, errorMessages.CREDENTIALS));
  }

  user.email = email;
  user.emailVerified = false;

  await user.save();

  res
    .status(200)
    .json({ email: user.email, emailVerified: user.emailVerified });
});

const editUserType = asyncHandler(async (req, res, next) => {
  const { userType } = req.body;

  const user = await userModel.findById(req.user.id);

  user.userType = userType;

  await user.save();

  res.status(200).json({ userType });
});

const editPassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return next(new CustomError(400, errorMessages.MISSING_FIELDS));
  }

  const user = await userModel.findById(req.user.id);

  if (!(await bcrypt.compare(oldPassword, user.password))) {
    return next(new CustomError(400, errorMessages.CREDENTIALS));
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashedPassword;
  await user.save();

  if (user.emailNotification) {
    emailService.editCreatorPassword(user.email);
  }

  res.status(200).json('ok');
});

const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);
  const { password } = req.body;

  if (!password) {
    return next(new CustomError(400, 'Missing data'));
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return next(new CustomError(400, errorMessages.CREDENTIALS));
  }

  await executeInTransaction(async (session) => {
    await userModel.updateOne(
      { _id: user._id },
      {
        isArchived: true,
        email: `${user.email}.archived.${Date.now()}`,
        pseudo: `${user.pseudo}.archived.${Date.now()}`,
      },
      { session },
    );
    await nudeModel.updateMany(
      { user: user._id },
      { isArchived: true },
      { session },
    );
    await conversationModel.updateMany(
      { participants: user._id },
      { isArchived: true },
      { session },
    );
  });

  res.status(200).json('Ok');
});

const editBankDetails = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);
  const { name, iban, street, zip, city, country } = req.body;

  if (!name || !iban) {
    return next(new CustomError(400, errorMessages.MISSING_FIELDS));
  }

  await userModel.updateOne(
    { _id: user._id },
    {
      bankAccount: {
        name: name,
        iban: iban,
        address: {
          street: street,
          zip: zip,
          city: city,
          country: country,
        },
      },
    },
  );

  res.status(200).json('Ok');
});

const editEmailNotification = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);
  const { emailNotification } = req.body;

  if (typeof emailNotification !== 'boolean') {
    return next(new CustomError(400, errorMessages.MISSING_FIELDS));
  }

  await userModel.updateOne(
    { _id: user._id },
    {
      emailNotification: emailNotification,
    },
  );

  res.status(200).json({ emailNotification });
});

const editInappNotification = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);
  const { notificationType } = req.body;

  if (!notificationType) {
    return next(new CustomError(400, errorMessages.MISSING_FIELDS));
  }

  let newNotificationTypes = [...user.inappNotification];

  if (newNotificationTypes.includes(notificationType)) {
    newNotificationTypes = [
      ...newNotificationTypes.filter(
        (currentNotificationType) =>
          currentNotificationType !== notificationType,
      ),
    ];
  } else {
    newNotificationTypes = [...newNotificationTypes, notificationType];
  }

  await userModel.updateOne(
    { _id: user._id },
    {
      inappNotification: newNotificationTypes,
    },
  );

  res.status(200).json({
    inappNotification: newNotificationTypes,
  });
});

const getReferrals = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);

  const referrals = await userModel.find({
    referredBy: user._id,
    isArchived: false,
  });

  res.status(200).json(referrals);
});

const sendTips = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);
  const { userId, tipsAmount } = req.body;

  const userWhoReceiveTips = await userModel.findById(userId);

  if (!userWhoReceiveTips) {
    return next(new CustomError(404, 'not_found'));
  }

  const { fiatPrice, creditPrice } = getPriceInFiatFromCredits(tipsAmount);

  if (user.creditAmount < creditPrice) {
    return next(new CustomError(400, errorMessages.NOT_ENOUGH_CREDIT));
  }

  await executeInTransaction(async (session) => {
    const newMemberCreditAmount = user.creditAmount - creditPrice;

    await userModel.updateOne(
      { _id: user._id },
      {
        creditAmount: newMemberCreditAmount,
      },
      { session },
    );

    await saleModel.create(
      [
        {
          owner: userWhoReceiveTips._id,
          fromUser: user._id,
          saleType: 'tip',
          amount: {
            fiatValue: fiatPrice,
            creditValue: creditPrice,
            currency: 'EUR',
          },
        },
      ],
      { session },
    );
  });

  res.status(200).json(creditPrice);
});

const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, { expiresIn: '30d' });
};

module.exports = {
  register,
  login,
  resetPasswordRequest,
  resetPassword,
  getUser,
  profileVisit,
  getAllUsers,
  getAccountOwner,
  userProfile,
  addProfilPicture,
  refreshCreditAmount,
  notificationSubscribe,
  checkIfUserVerified,
  identityVerification,
  editEmail,
  editPassword,
  deleteUser,
  editBankDetails,
  editEmailNotification,
  editInappNotification,
  getReferrals,
  sendTips,
  editUserType,
  getVerificationStep,
  getIdentityVerificationUrl,
};
