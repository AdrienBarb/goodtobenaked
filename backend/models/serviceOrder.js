const mongoose = require('mongoose');

const serviceOrderSchema = mongoose.Schema(
  {
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
    state: {
      type: String,
      enum: [
        'new',
        'accepted',
        'rejectedByBuyer',
        'rejectedBySeller',
        'completed',
        'commentedFromMember',
      ],
      default: 'new',
    },
    status: {
      type: String,
      enum: ['initialized', 'failed', 'succeeded'],
      default: 'initialized',
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
    },
    privateService: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PrivateService',
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
    cost: {
      type: Number,
    },
    deliveryCost: {
      type: Number,
    },
    activities: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderActivity' }],
    },
    haveBeenPaid: {
      type: Boolean,
      default: false,
    },
    deliveryAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
    },
    instruction: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('ServiceOrder', serviceOrderSchema);
