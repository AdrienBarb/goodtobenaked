const mongoose = require('mongoose');

const ShippingFeeSchema = new mongoose.Schema({
  region: {
    type: String,
    required: true
  },
  countries: [{
    type: String,
    required: true
  }],
  fees: {
    small: {
      type: Number,
      required: true
    },
    medium: {
      type: Number,
      required: true
    },
    large: {
      type: Number,
      required: true
    }
  }
});

module.exports = mongoose.model('ShippingFee', ShippingFeeSchema);

