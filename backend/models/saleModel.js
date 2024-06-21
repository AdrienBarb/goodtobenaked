const mongoose = require('mongoose');

const amountSchema = mongoose.Schema(
  {
    baseValue: {
      type: Number,
      required: true,
      default: 0,
    },
    commission: {
      type: Number,
      default: 0,
    },
    baseValueWithCommission: {
      type: Number,
      default: 0,
    },
    creditValue: {
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

const saleSchema = mongoose.Schema(
  {
    //owner of the sale
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    amount: amountSchema,
    saleType: {
      type: String,
      required: true,
      enum: ['nude', 'commission', 'tip'],
    },
    nude: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Nude',
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Sale', saleSchema);
