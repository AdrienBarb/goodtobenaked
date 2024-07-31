const VerificationCode = require('../models/verificationCodeModel');
const emailService = require('../lib/email');
const { generateRandomCode } = require('../lib/utils');
const asyncHandler = require('express-async-handler');
const userModel = require('../models/userModel');
const { errorMessages } = require('../lib/constants');
const CustomError = require('../lib/error/CustomError');
const { executeInTransaction } = require('../db');

const sendVerificationCode = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);

  const userId = user._id.toString();

  await VerificationCode.deleteMany({
    userId: userId,
  });

  const code = generateRandomCode(6);

  await VerificationCode.create({
    userId: user._id,
    code: code,
  });

  emailService.sendVerificationCode(user.email, code);

  res.status(200).json('Ok');
});

const verifyCode = asyncHandler(async (req, res, next) => {
  const { code } = req.body;
  const user = await userModel.findById(req.user.id);

  if (!code) {
    return next(new CustomError(400, errorMessages.MISSING_FIELDS));
  }

  const verificationCode = await VerificationCode.findOne({
    userId: user._id,
    code: code,
  });

  if (!verificationCode) {
    return next(new CustomError(400, errorMessages.INVALID_CODE));
  }

  await executeInTransaction(async (session) => {
    user.emailVerified = true;
    await user.save({ session });
    await VerificationCode.deleteOne(
      { _id: verificationCode?._id },
      { session },
    );
  });

  res.status(200).json({ emailVerified: user.emailVerified });
});

module.exports = {
  sendVerificationCode,
  verifyCode,
};
