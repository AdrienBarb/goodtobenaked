const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Creator',
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Member',
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  withOptions: {
    type: Boolean,
    required: true,
  },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
  },
  options: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Option',
    },
  ],
  state: {
    type: String,
    enum: [
      'new',
      'accepted',
      'rejectedBySeller',
      'rejectedByBuyer',
      'completed',
      'commentedFromMember',
    ],
    default: 'new',
  },
  deliveryAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
  },
  activities: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderActivity' }],
  },
  trackingLink: {
    type: String,
  },
  trackingNumber: {
    type: String,
  },
  haveBeenPaid: {
    type: Boolean,
    default: false,
  },
  instruction: {
    type: String,
  },
  cost: {
    type: Number,
  },
  deliveryCost: {
    type: Number,
  },
  succeed: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['initialized', 'failed', 'succeeded'],
    default: 'initialized',
  },
  createdAt: {
    type: String,
  },
});

module.exports = mongoose.model('Order', orderSchema);
