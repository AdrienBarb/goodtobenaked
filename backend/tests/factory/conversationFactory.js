const { Factory } = require('rosie');
const mongoose = require('mongoose');
const conversationModel = require('../../models/conversationModel');

const ConversationFactory = new Factory()
  .attr('participants', [
    () => new mongoose.Types.ObjectId(),
    () => new mongoose.Types.ObjectId(),
  ])
  .attr('messages', []);

const createConversation = async ({ participants, messages }) => {
  const conversationData = ConversationFactory.build({
    participants,
    messages: messages || [],
  });
  const conversation = new conversationModel(conversationData);
  return conversation.save();
};

module.exports = createConversation;
