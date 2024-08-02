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

nudeSchema.index({ isArchived: 1 });
nudeSchema.index({ visibility: 1 });
nudeSchema.index({ user: 1 });
nudeSchema.index({ isFree: 1 });
nudeSchema.index({ paidMembers: 1 });
nudeSchema.index({ tags: 1 });

nudeSchema.index({ isArchived: 1, visibility: 1 });
nudeSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Nude', nudeSchema);
