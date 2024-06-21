const expressAsyncHandler = require('express-async-handler');
const SNSMessageValidator = require('sns-validator');
const mediaModel = require('../models/mediaModel');
const { default: axios } = require('axios');
const socketManager = require('../lib/socket/socketManager');
const validator = new SNSMessageValidator();

const confirmSubscription = (message) => {
  const url = message.SubscribeURL;
  axios.get(url, (res) => {
    if (res.statusCode === 200) {
      console.log('Subscription confirmed');
    } else {
      console.error('Subscription confirmation failed');
    }
  });
};

const getSnsNotification = expressAsyncHandler(async (req, res) => {
  const message = req.body;

  validator.validate(message, async (err, message) => {
    if (err) {
      console.error('SNS Message validation failed:', err);
      return res.status(400).json({ error: 'Invalid SNS message' });
    }

    if (message.Type === 'SubscriptionConfirmation') {
      console.log('SubscriptionConfirmation received');
      confirmSubscription(message);
      res.status(200).send('OK');
    } else if (message.Type === 'Notification') {
      const { userId, key, status } = JSON.parse(message.Message);

      try {
        const media = await mediaModel.findOne({ user: userId, fileName: key });

        media.status = status;
        await media.save();

        socketManager.emitToUser(userId, 'mediaStatusUpdated', media);

        res.status(200).json({ message: 'Media status updated successfully' });
      } catch (error) {
        console.error('Error updating media status:', error);
        res.status(500).json({ error: 'Error updating media status' });
      }
    } else {
      res.status(200).send('OK');
    }
  });
});

module.exports = {
  getSnsNotification,
};
