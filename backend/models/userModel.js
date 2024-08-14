const mongoose = require('mongoose');
const moment = require('moment');

const revenueSchema = new mongoose.Schema({
  isBankTransferAutomatic: {
    type: Boolean,
    default: false,
  },
  invoices: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice',
      },
    ],
    default: [],
  },
});

const addressSchema = new mongoose.Schema({
  street: {
    type: String,
  },
  zip: {
    type: String,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
});

const bankAccountSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  iban: {
    type: String,
  },
  address: addressSchema,
});

const userSchema = mongoose.Schema(
  {
    pseudo: {
      type: String,
      required: [true, 'Please add a pseudo'],
      unique: [true, 'This pseudo already exist'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: [true, 'This email already exist'],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    userType: {
      type: String,
      enum: ['creator', 'member'],
    },
    gender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GenderCategory',
    },
    profileImage: {
      type: String,
      default: '',
    },
    secondaryProfileImages: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }],
      default: [],
    },
    emailNotification: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      default: '',
    },
    nationality: {
      type: String,
    },
    breastSize: {
      type: String,
    },
    buttSize: {
      type: String,
    },
    bodyType: {
      type: String,
    },
    hairColor: {
      type: String,
    },
    age: {
      type: Number,
    },
    verified: {
      type: String,
      enum: ['unverified', 'rejected', 'pending', 'verified'],
      default: 'unverified',
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    country: {
      type: String,
    },
    salesFee: {
      type: Number,
      default: 0.2,
    },
    revenue: revenueSchema,
    bankAccount: bankAccountSchema,
    inappNotification: {
      type: [String],
      default: ['profile_viewed'],
    },
    lastLogin: {
      type: Date,
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    notificationSubscribers: {
      type: [],
      default: [],
    },
    profileViewers: {
      type: [],
      default: [],
    },
    messageSenders: {
      type: [],
      default: [],
    },
    nudeBuyers: {
      type: [],
      default: [],
    },
    version: {
      type: Number,
      default: 2,
    },
    isAmbassador: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    creditAmount: {
      type: Number,
      default: 0,
    },
    promotionEndDate: {
      type: Date,
      default: () => moment.utc().add(3, 'months').startOf('day').toDate(),
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('User', userSchema);
