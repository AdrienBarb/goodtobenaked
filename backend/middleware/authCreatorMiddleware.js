const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Creator = require('../models/creatorModel');
const moment = require('moment-timezone');

const creatorProtect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const creator = await Creator.findById(decoded.id).select('-password');

      if (!creator) {
        return res.status(401).json('Invalid token');
      }

      await Creator.updateOne(
        { _id: creator?._id },
        {
          lastLogin: moment().tz('Europe/Paris').format(),
        },
      );

      req.user = creator;

      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json('Invalid token');
    }
  }

  if (!token) {
    return res.status(401).json('Invalid token');
  }
});

module.exports = { creatorProtect };
