const mongoose = require("mongoose");

const optionSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    additionalCost: {
      type: Number,
      default: 0,
    },
    serviceFee: {
      type: Number,
      required: true,
    },
    serviceFeeVat: {
      type: Number,
      required: true,
    },
    totalAdditionalCost: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Option", optionSchema);
