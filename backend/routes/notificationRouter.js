const express = require('express');

const {
  getNotifications,
  markNotificationsAsRead,
  getUnreadNotificationsCount,
} = require('../controllers/notificationController');

const { userProtect } = require('../middleware/authUserMiddleware');

const router = express.Router();

router.get('/', userProtect, getNotifications);
router.put('/mark-as-read', userProtect, markNotificationsAsRead);
router.get('/unread-count', userProtect, getUnreadNotificationsCount);

module.exports = router;
