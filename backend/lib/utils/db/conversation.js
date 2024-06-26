const conversationModel = require('../../../models/conversationModel');

const fetchConversation = async (orderId) => {
  const conversation = await conversationModel
    .findById(orderId)
    .populate('member')
    .populate('creator')
    .populate('messages');

  if (!conversation) {
    throw new Error('Data not found');
  }

  return conversation;
};

module.exports = {
  fetchConversation,
};
