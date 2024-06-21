const mongoose = require('mongoose');

const creatorIdentityVerificationSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    frontIdentityImageName: {
      type: String,
      required: true,
    },
    backIdentityImageName: {
      type: String,
      required: true,
    },
    frontAndFaceIdentityImageName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model(
  'creatorIdentityVerification',
  creatorIdentityVerificationSchema,
);
