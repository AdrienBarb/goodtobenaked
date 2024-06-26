const mongoose = require('mongoose');

const profileVisitSchema = mongoose.Schema(
  {
    visitedUser: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    visitor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('ProfileVisit', profileVisitSchema);
