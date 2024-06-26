const mongoose = require("mongoose");

const imageContentSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Creator",
    },
    description: {
      type: String,
      required: false,
    },
    isPaidContent: {
      type: Boolean,
      required: false,
    },
    credit: {
      type: Number,
      required: false,
    },
    authorizedMember: {
      type: Array,
      required: false,
    },
    imageName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ImageContent", imageContentSchema);
