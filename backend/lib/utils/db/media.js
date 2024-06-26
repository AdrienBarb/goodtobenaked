const mediaModel = require('../../../models/mediaModel');

const fetchMedia = async (mediaId) => {
  const media = await mediaModel.findById(mediaId).populate('creator');

  if (!media) {
    throw new Error('Data not found');
  }

  return media.toObject();
};

module.exports = {
  fetchMedia,
};
