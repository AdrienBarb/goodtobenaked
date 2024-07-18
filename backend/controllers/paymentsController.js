const asyncHandler = require('express-async-handler');
const creditTransactionModel = require('../models/creditTransactionModel');
const userModel = require('../models/userModel');
const config = require('../config');
const stripe = require('stripe')(config.stripeApiKey);

const createPaymentIntent = asyncHandler(async (req, res, next) => {
  const { price } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    currency: 'eur',
    amount: price,
    payment_method_types: ['card', 'link'],
  });

  res.status(200).json({
    clientSecret: paymentIntent.client_secret,
    stripeTransactionId: paymentIntent.id,
    amount: paymentIntent.amount,
  });
});

const checkoutPayment = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);
  const { creditAmount, stripeTransactionId } = req.body;

  await creditTransactionModel.create({
    user: user,
    creditAmount: creditAmount,
    stripeId: stripeTransactionId,
  });

  res.status(200).json('ok');
});

module.exports = {
  createPaymentIntent,
  checkoutPayment,
};
