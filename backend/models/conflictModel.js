const mongoose = require("mongoose");

const conflictSchema = mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Creator",
    },
    member: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Member",
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Order",
    },
    complainant: {
      type: String,
      enum: ['member', 'creator'],
    },
    state: {
      type: String,
      enum: ['open', 'close'],
      default: 'open',
    },
    explanation: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Conflict", conflictSchema);
