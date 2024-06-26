const mongoose = require("mongoose");

const packageSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ["basic", "standard", "premium"],
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    serviceFee: {
      type: Number,
      required: true,
    },
    serviceFeeVat: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    options: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Option",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Package", packageSchema);