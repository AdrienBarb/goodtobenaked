const asyncHandler = require('express-async-handler');
const userModel = require('../models/userModel');
const Invoice = require('../models/invoiceModel');
const CreatorIdentityVerification = require('../models/creatorIdentityVerificationModel');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const emailService = require('../lib/email');
const config = require('../config');

// @desc Get current creator
// @route GET /api/admin/creators/:creatorId
// @access Private
const getCurrentCreatorIdentityCheck = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const user = await userModel.findById(userId);

  const identityVerication = await CreatorIdentityVerification.findOne({
    userId: user?._id,
  });

  const s3 = new S3Client({
    credentials: {
      accessKeyId: config.awsAccessKeyId,
      secretAccessKey: config.awsSecretAccessKey,
    },
    region: config.awsRegion,
  });

  let frontIdentityImageUrl = null;
  if (identityVerication?.frontIdentityImageName) {
    const command = new GetObjectCommand({
      Bucket: config.s3BucketProcessedMedia,
      Key: identityVerication?.frontIdentityImageName,
    });
    frontIdentityImageUrl = await getSignedUrl(s3, command, {
      expiresIn: 3600,
    });
  }

  let backIdentityImageUrl = null;
  if (identityVerication?.backIdentityImageName) {
    const command = new GetObjectCommand({
      Bucket: config.s3BucketProcessedMedia,
      Key: identityVerication?.backIdentityImageName,
    });
    backIdentityImageUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
  }

  let frontAndFaceIdentityImageUrl = null;
  if (identityVerication?.frontAndFaceIdentityImageName) {
    const command = new GetObjectCommand({
      Bucket: config.s3BucketProcessedMedia,
      Key: identityVerication?.frontAndFaceIdentityImageName,
    });
    frontAndFaceIdentityImageUrl = await getSignedUrl(s3, command, {
      expiresIn: 3600,
    });
  }

  if (user && identityVerication) {
    res.status(200).json({
      _id: user?._id,
      pseudo: user?.pseudo,
      verified: user?.verified,
      frontIdentityImageUrl: frontIdentityImageUrl,
      backIdentityImageUrl: backIdentityImageUrl,
      frontAndFaceIdentityImageUrl: frontAndFaceIdentityImageUrl,
    });
  } else {
    res.status(500).json('Error while fetching creators');
    throw new Error('Error while fetching creators');
  }
});

// @desc Change verification state
// @route GET /api/admin/creators/:creatorId
// @access Private
const changeVerificationState = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { state } = req.body;

  const user = await userModel.findById(userId);

  try {
    await userModel.updateOne(
      { _id: user?._id },
      {
        verified: state,
      },
    );

    const link = `${config.clientUrl}/`;

    emailService.sendCreatorAccountVerificationUpdate(user?.email, state, link);

    res.status(200).json('State updated');
  } catch (error) {
    res.status(500).json('Error while updating');
    throw new Error(error);
  }
});

// @desc Change verification state
// @route POST /api/admin/invoices/:invoiceId
// @access Private
const payCreator = asyncHandler(async (req, res, next) => {
  const { invoiceId } = req.params;

  try {
    const invoice = await Invoice.findById(invoiceId).populate('user');

    if (!invoice) {
      res.status(500).json('Invoice not found');
      throw new Error('Invoice not found');
    }

    await Invoice.updateOne(
      { _id: invoice?._id },
      {
        paid: true,
      },
    );

    emailService.sendPayInvoice(invoice?.user?.email);

    res.status(200).json('Invoice paid');
  } catch (error) {
    res.status(500).json('Error while paying invoice');
    throw new Error(error);
  }
});

module.exports = {
  getCurrentCreatorIdentityCheck,
  changeVerificationState,
  payCreator,
};
