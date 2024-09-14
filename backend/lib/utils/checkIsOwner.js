const mongoose = require('mongoose');

const checkIsOwner = (ownerId, userId) => {
  if (!ownerId || !userId) {
    return false;
  }

  if (typeof ownerId === 'string') {
    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return false;
    }
    ownerId = mongoose.Types.ObjectId(ownerId);
  }

  if (typeof userId === 'string') {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return false;
    }
    userId = mongoose.Types.ObjectId(userId);
  }

  return ownerId.equals(userId);
};

module.exports = checkIsOwner;
