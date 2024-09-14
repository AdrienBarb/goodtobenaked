const checkIsOwner = require('./checkIsOwner');

const getNudePermissions = (nude, userId) => {
  const isOwner = checkIsOwner(nude.user._id, userId);

  const canEdit = isOwner;
  const canView = nude.isFree || isOwner || nude.paidMembers.includes(userId);
  const canBuy = !nude.isFree && !nude.paidMembers.includes(userId) && !isOwner;

  return {
    canEdit,
    canView,
    canBuy,
  };
};

module.exports = getNudePermissions;
