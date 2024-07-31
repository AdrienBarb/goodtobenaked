const mongoose = require('mongoose');
const moment = require('moment');

const amountSchema = mongoose.Schema(
  {
    fiatValue: {
      type: Number,
      required: true,
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
      enum: ['nude', 'commission', 'tip', 'message'],
    },
    nude: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Nude',
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    availableDate: {
      type: Date,
      default: () => moment.utc().add(7, 'days').startOf('day').toDate(),
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Sale', saleSchema);
