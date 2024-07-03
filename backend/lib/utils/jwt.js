const jwt = require('jsonwebtoken');
const config = require('../../config');

module.exports = generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, { expiresIn: '30d' });
};
