const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Member = require('../models/memberModel');

const memberProtect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const member = await Member.findById(decoded.id).select('-password');

      if (!member) {
        return res.status(401).json('Invalid token');
      }

      req.user = member;

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

module.exports = { memberProtect };
