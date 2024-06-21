const mongoose = require("mongoose");

const subCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    slug: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SubCategory", subCategorySchema);
