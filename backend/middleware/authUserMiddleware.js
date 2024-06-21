const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const userModel = require('../models/userModel');
const moment = require('moment-timezone');
const { errorMessages } = require('../lib/constants');

const userProtect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await userModel.findById(decoded.id).select('-password');

      if (!user) {
        res.status(401).json(errorMessages.CREDENTIALS);
        return;
      }

      await userModel.updateOne(
        { _id: user?._id },
        {
          lastLogin: moment().tz('Europe/Paris').format(),
        },
      );

      req.user = user;

      next();
    } catch (error) {
      console.log(error);
      res.status(401).json(errorMessages.CREDENTIALS);
      return;
    }
  }

  if (!token) {
    res.status(401).json(errorMessages.NOT_AUTHORIZED);
    return;
  }
});

module.exports = { userProtect };
