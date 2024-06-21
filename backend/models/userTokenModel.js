const mongoose = require('mongoose');

const userTokenSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 86400,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('UserToken', userTokenSchema);
