const asyncHandler = require('express-async-handler');
const Creator = require('../models/creatorModel');
const userModel = require('../models/userModel');
const Conflict = require('../models/conflictModel');
const Invoice = require('../models/invoiceModel');
const CreatorIdentityVerification = require('../models/creatorIdentityVerificationModel');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const emailService = require('../lib/email');
const { createCreatorNotionCard } = require('../lib/services/notion');

// @desc Get all creators
// @route GET /api/admin/creators
// @access Private
const getCreators = asyncHandler(async (req, res, next) => {
  const creators = await Creator.find({ verified: { $ne: 'verified' } });

  if (creators) {
    res.status(200).json(creators);
  } else {
    res.status(500).json('Error while fetching creators');
    throw new Error('Error while fetching creators');
  }
});

// @desc Get current creator
// @route GET /api/admin/creators/:creatorId
// @access Private
const getCurrentCreatorIdentityCheck = asyncHandler(async (req, res, next) => {
  const { creatorId } = req.params;

  const creator = await Creator.findById(creatorId);

  const identityVerication = await CreatorIdentityVerification.findOne({
    userId: creator?._id,
  });

  const s3 = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
  });

  let frontIdentityImageUrl = null;
  if (identityVerication?.frontIdentityImageName) {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_PROCESSED_MEDIA,
      Key: identityVerication?.frontIdentityImageName,
    });
    frontIdentityImageUrl = await getSignedUrl(s3, command, {
      expiresIn: 3600,
    });
  }

  let backIdentityImageUrl = null;
  if (identityVerication?.backIdentityImageName) {
    const command = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: identityVerication?.backIdentityImageName,
    });
    backIdentityImageUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
  }

  let frontAndFaceIdentityImageUrl = null;
  if (identityVerication?.frontAndFaceIdentityImageName) {
    const command = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: identityVerication?.frontAndFaceIdentityImageName,
    });
    frontAndFaceIdentityImageUrl = await getSignedUrl(s3, command, {
      expiresIn: 3600,
    });
  }

  if (creator && identityVerication) {
    res.status(200).json({
      _id: creator?._id,
      pseudo: creator?.pseudo,
      verified: creator?.verified,
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
  const { creatorId } = req.params;
  const { state } = req.body;

  const creator = await userModel.findById(creatorId);

  try {
    await userModel.updateOne(
      { _id: creator?._id },
      {
        verified: state,
      },
    );

    const link = `${process.env.CLIENT_URL}/`;

    emailService.sendCreatorAccountVerificationUpdate(
      creator?.email,
      state,
      link,
    );

    res.status(200).json('State updated');
  } catch (error) {
    res.status(500).json('Error while updating');
    throw new Error(error);
  }
});

// @desc Get all conflicts
// @route GET /api/admin/conflicts
// @access Private
const getConflicts = asyncHandler(async (req, res, next) => {
  const conflicts = await Conflict.find({ state: 'open' })
    .populate('creator')
    .populate('member')
    .populate('order');

  if (conflicts) {
    res.status(200).json(conflicts);
  } else {
    res.status(500).json('Error while fetching creators');
    throw new Error('Error while fetching creators');
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
  getCreators,
  getCurrentCreatorIdentityCheck,
  changeVerificationState,
  getConflicts,
  payCreator,
};
