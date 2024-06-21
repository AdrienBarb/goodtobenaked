const mongoose = require("mongoose");

const auctionSchema = mongoose.Schema(
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product",
      },
      startingBid: {
        type: Number,
        required: true,
      },
      currentBid: {
        type: Number,
        required: true,
      },
      bidIncrement: {
        type: Number,
        required: true,
      },
      highestBidder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      startTime: {
        type: Date,
        required: true,
      },
      endTime: {
        type: Date,
        required: true,
      },
      auctionState: {
        type: String,
        enum: ["not_started", "ongoing", "ended"],
        default: "not_started",
      },
    },
    {
      timestamps: true,
    }
  );
  

module.exports = mongoose.model("Auction", auctionSchema);
