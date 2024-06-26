const mongoose = require("mongoose");

const verificationCodeSchema = mongoose.Schema(
  {
    userId: { 
      type: String, 
      required: true 
    },
    code: { 
      type: String, 
      required: true 
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 60 * 24,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("VerificationCode", verificationCodeSchema);
