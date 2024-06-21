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
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    nude: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Nude',
    },
    media: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media',
    },
    seen: {
      type: Boolean,
      default: false,
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
