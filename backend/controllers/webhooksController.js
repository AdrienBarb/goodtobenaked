const expressAsyncHandler = require('express-async-handler');
const creditTransactionModel = require('../models/creditTransactionModel');
const memberModel = require('../models/memberModel');
const config = require('../config');
const stripe = require('stripe')(config.stripeApiKey);
const { executeInTransaction } = require('../db');
const { notifySlack } = require('../lib/services/slack');
const userModel = require('../models/userModel');

const getStripeUpdates = expressAsyncHandler(async (request, response) => {
  let event = request.body;

  const endpointSecret = config.stripeEndpointSecret;

  if (endpointSecret) {
    const signature = request.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        signature,
        endpointSecret,
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return response.sendStatus(400);
    }
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;

      const tx = await creditTransactionModel.findOne({
        stripeId: paymentIntentSucceeded.id,
      });

      if (tx) {
        const user = await userModel.findById(tx.user);

        if (user) {
          const newCreditAmount = user.creditAmount + tx.creditAmount;

          await executeInTransaction(async (session) => {
            await userModel.updateOne(
              { _id: user._id },
              {
                creditAmount: newCreditAmount,
              },
              { session },
            );

            await creditTransactionModel.updateOne(
              { _id: tx._id },
              {
                status: 'completed',
              },
              { session },
            );
          });
        }
      }

      notifySlack(`Un achat : ${paymentIntentSucceeded.amount / 100} euros`);

      break;
    default:
      console.log(`Unhandled event type ${event.type}.`);
  }

  response.send();
});

module.exports = {
  getStripeUpdates,
};
