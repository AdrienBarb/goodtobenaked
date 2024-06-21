const express = require('express');

const {
  sendVerificationCode,
  verifyCode,
} = require('../controllers/emailController');
const { userProtect } = require('../middleware/authUserMiddleware');

const router = express.Router();

router.post('/send-verification-code', userProtect, sendVerificationCode);
router.post('/verify-code', userProtect, verifyCode);

module.exports = router;
