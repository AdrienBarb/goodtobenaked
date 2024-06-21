const Conversation = require("../../../models/conversationModel");
const Message = require("../../../models/messageModel");
const moment = require('moment')

const getUnreadMessagesOlderThanOneDay = async (userId) => {
    const oneDayAgo = moment().subtract(1, 'days').toDate();
  
    const conversations = await Conversation.find({
      $or: [{ creator: userId }, { member: userId }],
    });
  
    const unreadMessages = await Message.find({
      _id: { $in: conversations.map((c) => c.messages).flat() },
      sender: { $ne: userId },
      seen: false,
      notified: false,
      createdAt: { $lt: oneDayAgo },
    });
  
    return unreadMessages;
}

module.exports = {
  getUnreadMessagesOlderThanOneDay
}