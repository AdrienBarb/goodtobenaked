const express = require('express');

const {
  createPaymentIntent,
  checkoutPayment,
} = require('../controllers/paymentsController');

const router = express.Router();
const { userProtect } = require('../middleware/authUserMiddleware');

router.post('/create-payment-intent', userProtect, createPaymentIntent);
router.post('/checkout', userProtect, checkoutPayment);

module.exports = router;
