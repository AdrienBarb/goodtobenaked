const mongoose = require("mongoose");

const privateServiceSchema = mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Creator",
    },
    title: {
      type: String,
      required: true,
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
    saleState: {
      type: String,
      enum: ['active', 'sold'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PrivateService", privateServiceSchema);
