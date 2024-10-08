const asyncHandler = require('express-async-handler');
const Conversation = require('../models/conversationModel');
const Message = require('../models/messageModel');
const userModel = require('../models/userModel');
const { errorMessages } = require('../lib/constants');
const CustomError = require('../lib/error/CustomError');
const { executeInTransaction } = require('../db');
const saleModel = require('../models/saleModel');

const createConversation = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;

  const firstParticipant = await userModel.findById(req.user.id);
  const secondParticipant = await userModel.findById(userId);

  if (!firstParticipant || !secondParticipant) {
    return next(new CustomError(404, errorMessages.NOT_FOUND));
  }

  //Find conversation if exist
  let conversation = await Conversation.findOne({
    participants: { $all: [firstParticipant._id, secondParticipant._id] },
  });

  //If not exist, create one
  if (!conversation) {
    conversation = await Conversation.create({
      participants: [firstParticipant._id, secondParticipant._id],
    });
  }

  //Add firstParticipant ID in messageSenders array of secondParticipant
  const firstParticipantId = firstParticipant._id.toString();
  if (!secondParticipant.messageSenders.includes(firstParticipantId)) {
    secondParticipant.messageSenders = [
      ...secondParticipant.messageSenders,
      firstParticipantId,
    ];
  }
  await secondParticipant.save();

  res.status(201).json(conversation);
});

const getAllConversations = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);
  const { cursor } = req.query;

  let matchConditions = {
    participants: user._id,
    isArchived: false,
    messages: { $exists: true, $not: { $size: 0 } },
  };

  const pipeline = [
    {
      $match: matchConditions,
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
              profileImage: '$$participant.profileImage',
            },
          },
        },
        messages: 1,
        updatedAt: 1,
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
  ];

  if (cursor) {
    pipeline.push({
      $match: {
        'lastMessage.createdAt': { $lt: new Date(cursor) },
      },
    });
  }

  pipeline.push(
    {
      $sort: { 'lastMessage.createdAt': -1 },
    },
    {
      $limit: 30,
    },
    {
      $project: {
        participantDetails: 1,
        unreadMessage: 1,
        lastMessage: 1,
        updatedAt: 1,
      },
    },
  );

  const conversations = await Conversation.aggregate(pipeline);

  const nextCursor =
    conversations.length > 0 &&
    conversations[conversations.length - 1].lastMessage
      ? conversations[
          conversations.length - 1
        ].lastMessage.createdAt.toISOString()
      : null;

  res.status(200).json({
    conversations,
    nextCursor,
  });
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
              profileImage: '$$participant.profileImage',
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
  const conversation = await Conversation.findById(
    req.params.conversationId,
  ).populate('participants', '_id pseudo profileImage userType');

  if (!conversation) {
    return next(new CustomError(404, errorMessages.NOT_FOUND));
  }

  res.status(200).json(conversation);
});

const getConversationMessages = asyncHandler(async (req, res, next) => {
  const { conversationId } = req.params;

  let filter = { conversation: conversationId };

  const messages = await Message.find(filter).sort({ createdAt: 1 });

  res.status(200).json(messages);
});

const sendMessage = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);
  const { conversationId } = req.params;
  const { text, nudeId } = req.body;

  if (!conversationId) {
    return next(new CustomError(400, errorMessages.MISSING_FIELDS));
  }

  const conversation = await Conversation.findById(conversationId).populate(
    'participants',
  );

  if (!conversation) {
    return next(new CustomError(404, errorMessages.NOT_FOUND));
  }

  if (conversation.blockedUsers?.includes(user._id)) {
    return next(new CustomError(400, errorMessages.YOURE_BLOCKED));
  }

  const otherParticipant = conversation.participants.find(
    (participant) => !participant._id.equals(user._id),
  );
  const isOtherParticipantCreator = otherParticipant.userType === 'creator';

  if (isOtherParticipantCreator && user.creditAmount < 20) {
    return next(new CustomError(400, errorMessages.NOT_ENOUGH_CREDIT));
  }

  let messageValues = {
    sender: user._id,
    text: text,
    conversation: conversation,
  };

  if (nudeId) {
    messageValues.nude = nudeId;
  }

  const message = await Message.create(messageValues);

  await executeInTransaction(async (session) => {
    await Conversation.updateOne(
      { _id: conversation },
      {
        $push: { messages: message },
      },
      { session },
    );

    if (isOtherParticipantCreator) {
      const newMemberCreditAmount = user.creditAmount - 20;

      await userModel.updateOne(
        { _id: user._id },
        {
          creditAmount: newMemberCreditAmount,
        },
        { session },
      );

      await saleModel.create(
        [
          {
            owner: otherParticipant._id,
            fromUser: user._id,
            saleType: 'message',
            amount: {
              fiatValue: 10,
              creditValue: 20,
            },
          },
        ],
        { session },
      );
    }
  });

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
  getConversationMessages,
};
