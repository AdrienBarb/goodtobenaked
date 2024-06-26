const mongoose = require('mongoose');
const priceDetailsSchema = require('./priceDetailsModel');

const nudeSoldSchema = mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Creator',
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Member',
    },
    priceDetails: priceDetailsSchema,
    nude: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Nude',
    },
    haveBeenPaid: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['initialized', 'succeeded'],
      default: 'initialized',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('NudeSold', nudeSoldSchema);
