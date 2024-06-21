const asyncHandler = require('express-async-handler');
const Message = require('../models/messageModel');

// @desc Mark as read
// @route PUT /api/messages/:messageId/change-state
// @access Public
const changeCustomDemandStateMember = asyncHandler(async (req, res, next) => {
  const { messageId, temporaryToken, newDemandState } = req.body;

  let message = await Message.findById(messageId);

  if (!message) {
    message = await Message.findOne({ temporaryToken: temporaryToken });
  }

  if (!message) {
    res.status(400).json('Not found');
    throw new Error('Not found');
  }

  if (message?.customDemandState === 'canceled') {
    res.status(400).json('The offer has been cancelled');
    throw new Error('The offer has been cancelled');
  }

  if (message?.customDemandState === newDemandState) {
    res.status(400).json('The has already been change');
    throw new Error('The has already been change');
  }

  try {
    await Message.updateOne(
      { _id: message._id },
      { customDemandState: newDemandState },
    );
    res.status(200);
  } catch (error) {
    res.status(500).json('Not found');
    throw new Error('Not found');
  }
});

// @desc Mark as read
// @route PUT /api/messages/:messageId/mchange-state
// @access Public
const changeCustomDemandStateCreator = asyncHandler(async (req, res, next) => {
  const { messageId, temporaryToken, newDemandState } = req.body;

  let message = await Message.findById(messageId);

  if (!message) {
    message = await Message.findOne({ temporaryToken: temporaryToken });
  }

  if (!message) {
    res.status(400).json('Not found');
    throw new Error('Not found');
  }

  if (message?.customDemandState === 'canceled') {
    res.status(400).json('The offer has been cancelled');
    throw new Error('The offer has been cancelled');
  }

  if (message?.customDemandState === newDemandState) {
    res.status(400).json('The has already been change');
    throw new Error('The has already been change');
  }

  try {
    await Message.updateOne(
      { _id: message._id },
      { customDemandState: newDemandState },
    );
    res.status(200);
  } catch (error) {
    res.status(500).json('Not found');
    throw new Error('Not found');
  }
});

module.exports = {
  changeCustomDemandStateMember,
  changeCustomDemandStateCreator,
};
