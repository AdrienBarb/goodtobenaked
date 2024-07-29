const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
    },
    text: {
      type: String,
    },
    nude: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Nude',
    },
    seen: {
      type: Boolean,
      default: false,
    },
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    notified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Message', messageSchema);
