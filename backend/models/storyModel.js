const mongoose = require("mongoose");

const storySchema = mongoose.Schema(
  {
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Creator",
    },
    mediaKey: {
        type: String,
        default: null
    },
    availableUntil: {
        type: String,
        default: null
    },
    type: {
        type: String,
        default: 'image',
        enum: ['image', 'video']
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Story", storySchema);
