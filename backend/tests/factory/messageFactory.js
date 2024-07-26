const { Factory } = require('rosie');
const mongoose = require('mongoose');
const messageModel = require('../../models/messageModel');

const MessageFactory = new Factory()
  .attr('sender', () => new mongoose.Types.ObjectId().toString())
  .attr('text', 'Default message text')
  .attr('conversation', () => new mongoose.Types.ObjectId())
  .attr('seen', false)
  .attr('notified', false)
  .attr('createdAt', new Date());

const createMessage = async ({ sender, text, conversation, createdAt }) => {
  const messageData = MessageFactory.build({
    sender: sender || new mongoose.Types.ObjectId().toString(),
    text: text || 'Default message text',
    conversation: conversation || new mongoose.Types.ObjectId(),
    createdAt: createdAt || new Date(),
  });

  const message = new messageModel(messageData);
  return message.save();
};

module.exports = createMessage;
