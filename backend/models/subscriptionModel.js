const mongoose = require("mongoose");

const subscriptionSchema = mongoose.Schema(
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
    subscriptionDate: {
      type: String,
      required: true,
    },
    unsubscriptionDate: {
      type: String,
      default: null
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
