const mongoose = require('mongoose');

const mediaSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    mediaType: {
      type: String,
      enum: ['video', 'image'],
      required: true,
    },
    mediaPublicId: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    originalKey: {
      type: String,
      required: true,
    },
    convertedKey: {
      type: String,
      required: true,
    },
    blurredKey: {
      type: String,
      required: true,
    },
    posterKey: {
      type: String,
      required: true,
    },
    durationInMs: {
      type: String,
    },
    status: {
      type: String,
      enum: ['created', 'ready', 'error'],
      required: true,
      default: 'created',
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Media', mediaSchema);
