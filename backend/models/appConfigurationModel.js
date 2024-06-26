const mongoose = require('mongoose');

const appConfigurationSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('AppConfiguration', appConfigurationSchema);
