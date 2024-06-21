const mongoose = require('mongoose');

const mediaSoldSchema = mongoose.Schema(
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
    media: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Media',
    },
    haveBeenPaid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('MediaSold', mediaSoldSchema);
