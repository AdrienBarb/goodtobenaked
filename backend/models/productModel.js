const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Creator',
    },
    category: {
      type: String,
    },
    productType: {
      type: String,
      enum: ['virtual', 'physical'],
      default: 'physical',
    },
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubCategory',
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    material: {
      type: String,
    },
    duration: {
      type: String,
    },
    activity: {
      type: String,
    },
    price: {
      type: Number,
    },
    serviceFee: {
      type: Number,
    },
    serviceFeeVat: {
      type: Number,
    },
    totalPrice: {
      type: Number,
    },
    firstPackageTotalPrice: {
      type: Number,
    },
    productPicturesKeys: {
      type: [String],
    },
    favoriteUsers: {
      type: [],
    },
    favoriteCounter: {
      type: Number,
      default: 0,
    },
    saleState: {
      type: String,
      enum: ['active', 'sold', 'reserved'],
      default: 'active',
    },
    visibility: {
      type: String,
      enum: ['private', 'public'],
      default: 'public',
    },
    packageSize: {
      type: String,
      enum: ['small', 'medium', 'big'],
    },
    reservedDelay: {
      type: String,
    },
    visibleInGeneralListing: {
      type: Boolean,
      default: true,
    },
    permanent: {
      type: Boolean,
      default: false,
    },
    withOptions: {
      type: Boolean,
      default: false,
    },
    formStep: {
      type: Number,
      default: 0,
      required: true,
    },
    packages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package',
      },
    ],
    isDraft: {
      type: Boolean,
      default: true,
      required: true,
    },
    tags: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    version: {
      type: Number,
      default: 2,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Product', productSchema);
