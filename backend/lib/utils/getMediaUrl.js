const signedUrl = require('./signedUrl');

const getMediaUrl = (media, permissions, isHighRes) => {
  const cloudFrontUrl = process.env.CLOUDFRONT_URL;

  let imageUrl = `${cloudFrontUrl}${media.blurredKey}`;

  if (permissions.canView) {
    if (isHighRes) {
      imageUrl = signUrl(`${cloudFrontUrl}${media.convertedKey}`);
    } else {
      imageUrl = signedUrl(`${cloudFrontUrl}${media.posterKey}`);
    }
  }

  return imageUrl;
};

module.exports = getMediaUrl;
