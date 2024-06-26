const asyncHandler = require('express-async-handler');
const Member = require('../models/memberModel');
const MemberToken = require('../models/memberTokenModel');
const Creator = require('../models/creatorModel');
const CreatorToken = require('../models/creatorTokenModel');
const emailService = require('../lib/email');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const memberForgot = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).send('Please add all fields');
    throw new Error('Please add all fields');
  }

  const user = await Member.findOne({ email });
  if (!user) {
    res.status(400).send("User with given email doesn't exist");
    throw new Error("User with given email doesn't exist");
  }

  let memberToken = await MemberToken.findOne({ userId: user.id });
  if (!memberToken) {
    memberToken = await MemberToken.create({
      userId: user.id,
      token: crypto.randomBytes(32).toString('hex'),
    });
  }

  try {
    const link = `${process.env.CLIENT_URL}/members/password-reset/${user.id}/${memberToken.token}`;
    emailService.sendResetPasswordEmail(user.email, link);

    res.status(200).json({
      message: 'Email send',
    });
  } catch (error) {
    res.status(400).send('Error during email send');
  }
});

const resetMemberPassword = asyncHandler(async (req, res, next) => {
  const { password, userId, token } = req.body;

  if (!password || !userId || !token) {
    res.status(400).send('Missing fields');
    return;
  }

  const user = await Member.findById(userId);
  if (!user) {
    res.status(400).send('Invalid link or expired');
    return;
  }

  const memberToken = await MemberToken.findOne({
    userId: user.id,
    token: token,
  });

  if (!memberToken) {
    res.status(400).send('Invalid link or expired');
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await Member.updateOne({ _id: user.id }, { password: hashedPassword });
    await MemberToken.deleteOne({ _id: MemberToken._id });

    res.status(200).send('User updated');
  } catch (error) {
    res.status(400).send('An error occured');
  }
});

const creatorForgot = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).send('Please add all fields');
    return;
  }

  const user = await Creator.findOne({ email });
  if (!user) {
    res.status(200).send("user with given email doesn't exist");
    return;
  }

  let creatorToken = await CreatorToken.findOne({ userId: user._id });
  if (!creatorToken) {
    creatorToken = await CreatorToken.create({
      userId: user._id,
      token: crypto.randomBytes(32).toString('hex'),
    });
  }

  try {
    const link = `${process.env.CLIENT_URL}/creators/password-reset/${user._id}/${creatorToken.token}`;
    emailService.sendResetPasswordEmail(user.email, link);

    res.status(200).json({
      message: 'Email send',
    });
  } catch (error) {
    res.status(400).send('Error during email send');
  }
});

const resetCreatorPassword = asyncHandler(async (req, res, next) => {
  const { password, userId, token } = req.body;

  if (!password || !userId || !token) {
    res.status(400).send('Missing fields');
    return;
  }

  const user = await Creator.findById(userId);
  if (!user) {
    res.status(400).send('Invalid link or expired');
    return;
  }

  const creatorToken = await CreatorToken.findOne({
    userId: user._id,
    token: token,
  });

  if (!creatorToken) {
    res.status(400).send('Invalid link or expired');
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await Creator.updateOne({ _id: user._id }, { password: hashedPassword });
    await CreatorToken.deleteOne({ _id: CreatorToken._id });

    res.status(200).send('User updated');
  } catch (error) {
    res.status(400).send('An error occured.');
  }
});

module.exports = {
  memberForgot,
  resetMemberPassword,
  creatorForgot,
  resetCreatorPassword,
};
