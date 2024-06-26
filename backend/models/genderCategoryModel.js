const mongoose = require("mongoose");

const genderCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GenderCategory", genderCategorySchema);
