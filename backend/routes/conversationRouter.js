const express = require('express');

const {
  markAsRead,
  getAllConversations,
  getConversation,
  createConversation,
  manageBlockUser,
  sendMessage,
  checkIfUnreadMessages,
} = require('../controllers/conversationController');
const { userProtect } = require('../middleware/authUserMiddleware');

const router = express.Router();

router.get('/', userProtect, getAllConversations);
router.get('/unread-messages', userProtect, checkIfUnreadMessages);
router.get('/:conversationId', userProtect, getConversation);
router.post('/', userProtect, createConversation);
router.put('/:conversationId/block', userProtect, manageBlockUser);
router.post('/:conversationId/messages', userProtect, sendMessage);
router.put('/mark-as-read', userProtect, markAsRead);

module.exports = router;
