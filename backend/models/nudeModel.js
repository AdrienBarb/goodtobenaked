const mongoose = require('mongoose');
const priceDetailsSchema = require('./priceDetailsModel');

const nudeSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    description: {
      type: String,
    },
    priceDetails: priceDetailsSchema,
    isArchived: {
      type: Boolean,
      default: false,
    },
    isFree: {
      type: Boolean,
      required: true,
      default: true,
    },
    paidMembers: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    medias: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }],
      default: [],
      required: true,
    },
    visibility: {
      type: String,
      enum: ['public', 'private'],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Nude', nudeSchema);
