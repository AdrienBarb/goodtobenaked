const mongoose = require('mongoose');

const orderActivitySchema = mongoose.Schema(
  {
    fromUser: {
      type: String,
    },
    type: {
      type: String,
      required: true,
    },
    message: {
      type: String,
    },
    conflict: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conflict',
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('OrderActivity', orderActivitySchema);
