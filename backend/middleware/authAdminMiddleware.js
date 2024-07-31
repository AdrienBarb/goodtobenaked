const asyncHandler = require('express-async-handler');
const config = require('../config');

const adminProtect = asyncHandler(async (req, res, next) => {
  if (req.headers && req.headers.admin_private_key) {
    try {
      if (req.headers.admin_private_key !== config.adminPrivateKey) {
        res.status(401).json('Invalid api key');
        return;
      }

      next();
    } catch (error) {
      console.log(error);
      res.status(401).json('Invalid api key');
      return;
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no api key');
  }
});

module.exports = { adminProtect };
