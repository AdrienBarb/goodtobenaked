const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    destinator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Creator",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Member",
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    comment: {
      type: String,
    },
    rate: {
      type: Number,
      required: true,
      default: 0
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Comment", commentSchema);
