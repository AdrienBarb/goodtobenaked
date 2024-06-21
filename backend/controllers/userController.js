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
const { generateRandomCode } = require('../lib/utils');
const verificationCodeModel = require('../models/verificationCodeModel');
const nudeModel = require('../models/nudeModel');
const conversationModel = require('../models/conversationModel');
const { getPriceInFiatFromCredits } = require('../lib/utils/price');
const saleModel = require('../models/saleModel');

const register = asyncHandler(async (req, res, next) => {
  const { pseudo, email, password, referral } = req.body;

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

    //Create referral
    if (referral) {
      const referralUser = await userModel.findById(referral);

      if (referralUser) {
        user.referredBy = referralUser;
      }
    }

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

  const link = `${process.env.CLIENT_URL}/${locale}/login/password-reset/${user._id}/${userToken.token}`;
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
      'pseudo image verified version isAmbassador lastLogin description notificationSubscribers socialMediaLink country nationality isAccountVerified isArchived',
    )
    .populate('gender')
    .lean();

  if (!user) {
    return next(new CustomError(404, errorMessages.NOT_FOUND));
  }

  res.status(200).json(user);
});

const getAccountOwner = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const user = await userModel
    .findById(userId)
    .select(
      'pseudo email image version isAmbassador address salesFee country verified lastLogin description notificationSubscribers socialMediaLink nationality breastSize buttSize bodyType hairColor age bankAccount emailNotification inappNotification',
    )
    .populate('gender')
    .lean();

  if (!user) {
    return next(new CustomError(404, errorMessages.NOT_FOUND));
  }

  res.status(200).json(user);
});

const userProfile = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);
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

  await userModel.updateOne(
    { _id: user._id },
    {
      $set: {
        pseudo: values.pseudo ? values.pseudo : user.pseudo,
        description: values.description,
        socialMediaLink: {
          twitter: values.twitterLink,
          instagram: values.instagramLink,
          mym: values.mymLink,
          onlyfans: values.onlyfansLink,
        },
        ...(values.age && { age: parseInt(values.age, 10) }),
        ...(values.gender && { gender: values.gender }),
        ...(values.breastSize && { breastSize: values.breastSize }),
        ...(values.buttSize && { buttSize: values.buttSize }),
        ...(values.bodyType && { bodyType: values.bodyType }),
        ...(values.hairColor && { hairColor: values.hairColor }),
        ...(values.country && { country: values.country }),
      },
    },
  );

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
    await profileVisitModel.create(
      [
        {
          visitor: visitor,
          visitedUser: visitedUser,
        },
      ],
      { session },
    );

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
  const profilPicture = req.file;

  if (!profilPicture) {
    return next(new CustomError(400, 'Missing files'));
  }

  if (!user) {
    return next(new CustomError(404, 'Not found'));
  }

  const s3 = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
  });

  const image = sharp(profilPicture.buffer);
  const optimizedBuffer = await image
    .rotate()
    .resize(400, 500)
    .jpeg({ quality: 80 })
    .toBuffer();

  let imageToken = crypto.randomBytes(32).toString('hex');
  const imageKey = `profile/${user._id}/${imageToken}.jpg`;

  const profilPictureCommand = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_PROCESSED_MEDIA,
    Key: imageKey,
    Body: optimizedBuffer,
    ContentType: 'image/jpeg',
  });

  await s3.send(profilPictureCommand);

  const updatedImageData = { ...user.image, profil: imageKey };

  await userModel.updateOne({ _id: user._id }, { image: updatedImageData });

  res.status(200).json(imageKey);
});

const addBannerPicture = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id).lean();
  const banner = req.file;

  if (!banner) {
    return next(new CustomError(400, 'Missing files'));
  }

  if (!user) {
    return next(new CustomError(404, 'Not found'));
  }

  const s3 = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
  });

  const image = sharp(banner.buffer);
  const optimizedBuffer = await image
    .rotate()
    .resize(844, 300)
    .jpeg({ quality: 80 })
    .toBuffer();

  let imageToken = crypto.randomBytes(32).toString('hex');
  const bannerKey = `banner/${user._id}/${imageToken}.jpg`;

  const profilPictureCommand = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_PROCESSED_MEDIA,
    Key: bannerKey,
    Body: optimizedBuffer,
    ContentType: 'image/jpeg',
  });

  await s3.send(profilPictureCommand);

  const updatedImageData = { ...user.image, banner: bannerKey };

  await userModel.updateOne(
    { _id: user._id },
    {
      image: updatedImageData,
    },
  );

  res.status(200).json(bannerKey);
});

const getAllUsers = asyncHandler(async (req, res, next) => {
  const query = req.query;
  const aggregateQuery = [];

  const matchQuery = {
    isAccountVerified: true,
    isArchived: false,
    'image.profil': { $ne: '' },
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

  // Autres filtres en fonction du contenu de query
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
    $project: {
      pseudo: 1,
      'image.profil': 1,
      verified: 1,
      isHighlighted: 1,
      lastLogin: 1,
    },
  });

  const users = await userModel.aggregate(aggregateQuery);

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
  console.log('je passe laaa ');
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
  const isProfileCompleted = Boolean(user.image?.profil);
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
  const isProfileCompleted = Boolean(user.image?.profil);
  const isBankAccountCompleted = Boolean(
    user.bankAccount?.iban &&
      user.bankAccount?.name &&
      user.bankAccount?.address?.country,
  );
  const nudes = await nudeModel.find({ user: user, isArchived: false });

  console.log('nudes ', nudes.length);

  res.status(200).json({
    isEmailVerified,
    isIdentityVerified,
    isProfileCompleted,
    isBankAccountCompleted,
    isNudesPosted: nudes.length >= 3,
  });
});

const identityVerification = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);

  const frontIdentity = req.files['frontIdentity'];
  const backIdentity = req.files['backIdentity'];
  const frontAndFaceIdentity = req.files['frontAndFaceIdentity'];

  if (!frontIdentity || !backIdentity || !frontAndFaceIdentity) {
    return next(new CustomError(400, errorMessages.MISSING_FIELDS));
  }

  if (!user) {
    return next(new CustomError(404, errorMessages.NOT_FOUND));
  }

  try {
    const s3 = new S3Client({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      region: process.env.AWS_REGION,
    });

    const frontIdentity = `identity/${user._id.toString()}/frontIdentity`;
    const backIdentity = `identity/${user._id.toString()}/backIdentity`;
    const frontAndFaceIdentity = `identity/${user._id.toString()}/frontAndFaceIdentity`;

    const frontIdentityCommand = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_PROCESSED_MEDIA,
      Key: frontIdentity,
      Body: frontIdentity[0].buffer,
      ContentType: frontIdentity[0].mimetype,
    });
    const backIdentityCommand = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_PROCESSED_MEDIA,
      Key: backIdentity,
      Body: backIdentity[0].buffer,
      ContentType: backIdentity[0].mimetype,
    });
    const frontAndFaceIdentityCommand = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_PROCESSED_MEDIA,
      Key: frontAndFaceIdentity,
      Body: frontAndFaceIdentity[0].buffer,
      ContentType: frontAndFaceIdentity[0].mimetype,
    });

    await s3.send(frontIdentityCommand);
    await s3.send(backIdentityCommand);
    await s3.send(frontAndFaceIdentityCommand);

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

  const { basePrice, basePriceWithCommission, creditPrice, commission } =
    getPriceInFiatFromCredits(
      tipsAmount,
      user.isAmbassador ? 0 : user.salesFee,
    );

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
            baseValue: basePrice,
            commission: commission,
            baseValueWithCommission: basePriceWithCommission,
            creditValue: creditPrice,
            currency: 'EUR',
          },
        },
      ],
      { session },
    );

    if (userWhoReceiveTips.referredBy) {
      await saleModel.create(
        [
          {
            owner: userWhoReceiveTips.referredBy,
            fromUser: userWhoReceiveTips._id,
            saleType: 'commission',
            amount: {
              baseValue: Math.round(basePrice * 0.05),
            },
          },
        ],
        { session },
      );
    }
  });

  res.status(200).json(creditPrice);
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
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
  addBannerPicture,
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
};
