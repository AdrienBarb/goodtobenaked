const asyncHandler = require('express-async-handler');
const Notification = require('../models/notificationModel');
const userModel = require('../models/userModel');

const getNotifications = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);
  const { notificationType, cursor } = req.query;

  let filter = {
    targetUser: user._id,
  };

  if (notificationType) {
    filter.type = notificationType;
  }

  if (cursor) {
    filter.createdAt = { $lt: new Date(cursor) };
  }

  const notifications = await Notification.find(filter)
    .sort({ createdAt: -1 })
    .limit(20)
    .populate('fromUser')
    .populate('targetUser')
    .lean();

  const nextCursor =
    notifications.length > 0
      ? notifications[notifications.length - 1].createdAt
      : null;

  res.status(200).json({ notifications, nextCursor });
});

const markNotificationsAsRead = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);

  await Notification.updateMany(
    { targetUser: user._id },
    {
      read: true,
    },
  );

  res.status(200).json('Ok');
});

const getUnreadNotificationsCount = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);

  const notifications = await Notification.find({
    targetUser: user._id,
    read: false,
  });

  res.status(200).json(notifications.length > 0);
});

module.exports = {
  markNotificationsAsRead,
  getNotifications,
  getUnreadNotificationsCount,
};
