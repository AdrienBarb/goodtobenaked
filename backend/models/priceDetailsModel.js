const mongoose = require('mongoose');

const priceDetailsSchema = mongoose.Schema(
  {
    fiatPrice: {
      type: Number,
      default: 0,
    },
    creditPrice: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'EUR',
      enum: ['USD', 'EUR'],
    },
  },
  { _id: false },
);

module.exports = priceDetailsSchema;
