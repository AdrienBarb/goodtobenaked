const mongoose = require('mongoose');
const { creatorNotifications } = require('../lib/constants');

const creatorSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
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
    gender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GenderCategory',
    },
    profilPicture: {
      type: String,
    },
    bannerPicture: {
      type: String,
    },
    emailNotification: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
    },
    twitterLink: {
      type: String,
    },
    instagramLink: {
      type: String,
    },
    mymLink: {
      type: String,
    },
    onlyfansLink: {
      type: String,
    },
    nationality: {
      type: String,
    },
    breastSize: {
      type: String,
      enum: ['tiny', 'normal', 'big', 'huge'],
    },
    buttSize: {
      type: String,
      enum: ['small', 'normal', 'big', 'huge'],
    },
    bodyType: {
      type: String,
      enum: ['skinny', 'athletic', 'medium', 'curvy'],
    },
    hairColor: {
      type: String,
      enum: ['black', 'blonde', 'brunette', 'redhead'],
    },
    age: {
      type: Number,
    },
    verified: {
      type: String,
      enum: ['unverified', 'rejected', 'pending', 'verified'],
      default: 'unverified',
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    },
    shippingFees: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ShippingFee' }],
    },
    rate: {
      type: Number,
      default: 0,
    },
    rateCount: {
      type: Number,
      default: 0,
    },
    country: {
      type: String,
    },
    salesFee: {
      type: Number,
      default: 0.2,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
    },
    bankAccountName: {
      type: String,
    },
    bankAccountIBAN: {
      type: String,
    },
    automaticPayment: {
      type: Boolean,
      default: false,
    },
    invoices: {
      type: [],
    },
    invoiceAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
    },
    shippingCarriers: {
      type: [],
      default: ['manual'],
    },
    anonymous: {
      type: Boolean,
      default: false,
    },
    smallPackageDeliveryCost: {
      type: Number,
    },
    mediumPackageDeliveryCost: {
      type: Number,
    },
    bigPackageDeliveryCost: {
      type: Number,
    },
    completionProfilNotification: {
      type: Boolean,
      default: false,
    },
    inappNotification: {
      type: [],
      default: creatorNotifications,
    },
    lastLogin: {
      type: Date,
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Creator',
    },
    highlighted: {
      status: { type: Boolean, default: false },
      level: { type: Number, default: 1 },
      expiration: { type: String, default: null },
    },
    notificationSubscribers: {
      type: [],
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
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Creator', creatorSchema);
