const mongoose = require('mongoose');
const { memberNotifications } = require('../lib/constants');

const memberSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    pseudo: {
      type: String,
      required: [true, 'Please add a pseudo'],
      unique: [true, 'This pseudo already exist'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    verified: {
      type: Boolean,
    },
    emailNotification: {
      type: Boolean,
      default: true,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
    },
    profilPicture: {
      type: String,
    },
    description: {
      type: String,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    inappNotification: {
      type: [],
      default: memberNotifications,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    creditAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Member', memberSchema);
