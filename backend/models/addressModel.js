const mongoose = require("mongoose");

const addressSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    company: {
      type: String,
    },
    street_no: {
      type: String,
    },
    street1: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
    },
    zip: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    formattedAddress: {
      type: String,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    shippoId: {
      type: String,
    },
    email: {
      type: String,
    },
    isHeadOffice: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Address", addressSchema);