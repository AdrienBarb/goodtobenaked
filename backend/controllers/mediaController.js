const asyncHandler = require('express-async-handler');
const mediaModel = require('../models/mediaModel');
const CustomError = require('../lib/error/CustomError');
const { errorMessages } = require('../lib/constants');
const userModel = require('../models/userModel');
const crypto = require('crypto');
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const config = require('../config');

const generateUploadUrl = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);
  const { filetype } = req.body;

  const s3 = new S3Client({
    credentials: {
      accessKeyId: config.awsAccessKeyId,
      secretAccessKey: config.awsSecretAccessKey,
    },
    region: config.awsRegion,
  });

  const isImage = filetype.startsWith('image/');

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
    case 'video/mp4':
      fileExtension = 'mp4';
      break;
    case 'video/quicktime':
      fileExtension = 'mov';
      break;
    default:
      return next(new CustomError(400, errorMessages.INVALID_FILE));
  }

  const fileName = crypto.randomBytes(32).toString('hex');

  const generateKey = (userId, mediaType, fileName, extension, suffix = '') => {
    return `${userId}/${mediaType}${
      suffix ? `/${suffix}` : ''
    }/${fileName}.${extension}`;
  };

  const originalKey = generateKey(
    user._id.toString(),
    isImage ? 'images' : 'videos',
    fileName,
    fileExtension,
  );

  const media = await mediaModel.create({
    user: user,
    mediaType: isImage ? 'image' : 'video',
    mediaPublicId: fileName,
    fileName: fileName,
    originalKey: originalKey,
    convertedKey: `converted/${user._id.toString()}/${fileName}.${
      isImage ? 'jpg' : 'mp4'
    }`,
    blurredKey: `blurred/${user._id.toString()}/${fileName}.jpg`,
    posterKey: `poster/${user._id.toString()}/${fileName}.jpg`,
    status: 'created',
  });

  let command = new PutObjectCommand({
    Bucket: config.s3BucketMedia,
    Key: originalKey,
    ContentType: filetype,
  });

  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

  res.status(200).json({ url: signedUrl, media });
});

const createMedia = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);
  const { mediaType, mediaKey } = req.body;

  const media = await mediaModel.create({
    user: user,
    mediaType: mediaType,
    mediaPublicId: mediaKey,
  });

  res.status(201).json(media);
});

const getAllMedias = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user.id);

  const medias = await mediaModel
    .find({
      user: user._id,
      $or: [{ isArchived: false }, { isArchived: { $exists: false } }],
    })
    .sort({ createdAt: -1 });

  const cloudFrontUrl = process.env.CLOUDFRONT_URL;

  const updatedMedias = medias.map((media) => {
    return {
      _id: media._id,
      user: media.user,
      mediaType: media.mediaType,
      posterKey: media.posterKey
        ? signUrl(`${cloudFrontUrl}${media.posterKey}`)
        : null,
      status: media.status,
    };
  });

  res.status(200).json(updatedMedias);
});

const deleteMedia = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);
  const { mediaId } = req.body;

  const media = await mediaModel.findById(mediaId);

  if (!media.user.equals(user._id)) {
    return next(new CustomError(400, errorMessages.NOT_AUTHORIZED));
  }

  await mediaModel.updateOne(
    { _id: mediaId },
    {
      isArchived: true,
    },
  );

  res.status(200).json(mediaId);
});

module.exports = {
  createMedia,
  getAllMedias,
  deleteMedia,
  generateUploadUrl,
};
