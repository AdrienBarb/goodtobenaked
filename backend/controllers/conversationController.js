const asyncHandler = require('express-async-handler');
const Conversation = require('../models/conversationModel');
const Message = require('../models/messageModel');
const userModel = require('../models/userModel');
const { errorMessages } = require('../lib/constants');

const createConversation = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;

  const firstParticipant = await userModel.findById(req.user.id);
  const secondParticipant = await userModel.findById(userId);

  if (!firstParticipant || !secondParticipant) {
    return next(new CustomError(404, errorMessages.NOT_FOUND));
  }

  let conversation = await Conversation.findOne({
    participants: { $all: [firstParticipant._id, secondParticipant._id] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [firstParticipant._id, secondParticipant._id],
    });
  }

  res.status(201).json(conversation);
});

const getAllConversations = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);

  const conversations = await Conversation.aggregate([
    {
      $match: {
        participants: user._id,
        isArchived: false,
        messages: { $exists: true, $not: { $size: 0 } },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'participants',
        foreignField: '_id',
        as: 'participantDetails',
      },
    },
    {
      $project: {
        participantDetails: {
          $map: {
            input: '$participantDetails',
            as: 'participant',
            in: {
              _id: '$$participant._id',
              pseudo: '$$participant.pseudo',
              image: { profil: '$$participant.image.profil' },
            },
          },
        },
        messages: 1,
      },
    },
    {
      $match: {
        $expr: { $eq: [{ $size: '$participantDetails' }, 2] },
      },
    },
    {
      $lookup: {
        from: 'messages',
        localField: 'messages',
        foreignField: '_id',
        as: 'messages',
      },
    },
    {
      $addFields: {
        unreadMessage: {
          $anyElementTrue: {
            $map: {
              input: '$messages',
              as: 'message',
              in: {
                $and: [
                  { $not: ['$$message.seen'] },
                  {
                    $not: [{ $eq: ['$$message.sender', user._id.toString()] }],
                  },
                ],
              },
            },
          },
        },
        lastMessage: { $arrayElemAt: ['$messages', -1] },
      },
    },
    {
      $sort: { lastMessage: -1 },
    },
    {
      $project: {
        participantDetails: 1,
        unreadMessage: 1,
      },
    },
  ]);

  res.status(200).json(conversations);
});

const checkIfUnreadMessages = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);

  const conversations = await Conversation.aggregate([
    {
      $match: {
        participants: user._id,
        isArchived: false,
        messages: { $exists: true, $not: { $size: 0 } },
      },
    },
    {
      $lookup: {
        from: 'messages',
        localField: 'messages',
        foreignField: '_id',
        as: 'messages',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'participants',
        foreignField: '_id',
        as: 'participantDetails',
      },
    },
    {
      $project: {
        participantDetails: {
          $map: {
            input: '$participantDetails',
            as: 'participant',
            in: {
              _id: '$$participant._id',
              pseudo: '$$participant.pseudo',
              image: { profil: '$$participant.image.profil' },
            },
          },
        },
        messages: 1,
      },
    },
    {
      $match: {
        $expr: { $eq: [{ $size: '$participantDetails' }, 2] },
      },
    },
    {
      $addFields: {
        unreadMessage: {
          $anyElementTrue: {
            $map: {
              input: '$messages',
              as: 'message',
              in: {
                $and: [
                  { $not: ['$$message.seen'] },
                  {
                    $not: [{ $eq: ['$$message.sender', user._id.toString()] }],
                  },
                ],
              },
            },
          },
        },
        lastMessage: { $arrayElemAt: ['$messages', -1] },
      },
    },
    {
      $sort: { lastMessage: -1 },
    },
    {
      $project: {
        unreadMessage: 1,
      },
    },
  ]);

  const isUnreadMessages = conversations.some((el) => el.unreadMessage);

  res.status(200).json(isUnreadMessages);
});

const getConversation = asyncHandler(async (req, res, next) => {
  const conversation = await Conversation.findById(req.params.conversationId)
    .populate('participants', '_id pseudo image.profil')
    .populate('messages');

  res.status(200).json(conversation);
});

const sendMessage = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);
  const { conversationId } = req.params;
  const { text, nudeId } = req.body;

  if (!conversationId) {
    return next(new CustomError(400, errorMessages.MISSING_FIELDS));
  }

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    return next(new CustomError(404, errorMessages.NOT_FOUND));
  }

  if (conversation.blockedUsers?.includes(user._id)) {
    return next(new CustomError(400, errorMessages.YOURE_BLOCKED));
  }

  let messageValues = {
    sender: user._id,
    text: text,
  };

  if (nudeId) {
    messageValues.nude = nudeId;
  }

  const message = await Message.create(messageValues);

  await Conversation.updateOne(
    { _id: conversation },
    {
      $push: { messages: message },
    },
  );

  res.status(201).json(message);
});

const markAsRead = asyncHandler(async (req, res, next) => {
  const { messageId } = req.body;

  const message = await Message.findById(messageId);

  if (!message) {
    return next(new CustomError(404, errorMessages.NOT_FOUND));
  }

  await Message.updateOne({ _id: message._id }, { seen: true });

  res.status(200).json(message);
});

const manageBlockUser = asyncHandler(async (req, res, next) => {
  const { conversationId } = req.params;
  const { userId } = req.body;

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    return next(new CustomError(404, errorMessages.NOT_FOUND));
  }

  if (!userId) {
    return next(new CustomError(400, errorMessages.MISSING_FIELDS));
  }

  if (conversation.blockedUsers?.includes(userId)) {
    conversation.blockedUsers = [
      ...conversation.blockedUsers.filter((c) => c !== userId),
    ];
  } else {
    conversation.blockedUsers = [...conversation.blockedUsers, userId];
  }

  await conversation.save();

  res.status(200).json(conversation.blockedUsers);
});

module.exports = {
  markAsRead,
  getAllConversations,
  getConversation,
  createConversation,
  manageBlockUser,
  sendMessage,
  checkIfUnreadMessages,
};
