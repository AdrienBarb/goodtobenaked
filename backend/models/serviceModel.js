const mongoose = require("mongoose");

const serviceSchema = mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Creator",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
    },
    subCategory: {
      type: String,
    },
    tags: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    },
    countries: [{
      type: String,
    }],
    imageKeys: [{
      type: String,
    }],
    step: {
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
    reviews: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    },
    rate: {
      type: Number,
      default: 0
    },
    rateCount: {
      type: Number,
      default: 0
    },
    rateCount: {
      type: Number,
      default: 0
    },
    packageSize: {
      type: String,
      enum: ['small', 'medium', "big"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Service", serviceSchema);
