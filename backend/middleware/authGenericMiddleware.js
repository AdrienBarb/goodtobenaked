const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Creator = require('../models/creatorModel');
const Member = require('../models/memberModel');
const moment = require('moment-timezone');

const userProtect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Try to find a member with the decoded ID
      let user = await Member.findById(decoded.id).select('-password');

      // If no member was found, try to find a creator
      if (!user) {
        user = await Creator.findById(decoded.id).select('-password');
      }

      if (!user) {
        res.status(401).json('Invalid token');
        return;
      }

      if (user instanceof Creator) {
        await Creator.updateOne(
          { _id: user._id },
          {
            lastLogin: moment().tz('Europe/Paris').format(),
          },
        );
        req.role = 'creator';
      } else {
        req.role = 'member';
      }

      req.user = user;
    } catch (error) {
      console.log(error);
      res.status(401).json('Invalid token');
      return;
    }
  } else {
    // No token provided, user is a visitor
    req.role = 'visitor';
  }

  next();
});

module.exports = { userProtect };
