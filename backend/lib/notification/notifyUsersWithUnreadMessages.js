const Member = require('../../models/memberModel');
const Creator = require('../../models/creatorModel');
const Message = require('../../models/messageModel');
const {
  getUnreadMessagesOlderThanOneDay,
} = require('../utils/db/getUnreadMessagesOlderThanOneDay');
const emailService = require('../../lib/email');

const notifyMembersWithUnreadMessages = async () => {
  const members = await Member.find({ isArchived: false });

  for (const member of members) {
    const unreadMessages = await getUnreadMessagesOlderThanOneDay(member._id);

    if (unreadMessages.length > 0) {
      if (member?.emailNotification) {
        const memberConversationsLink = `${process.env.CLIENT_URL}/members/messages`;
        emailService.notifyUserForUnreadMessage(
          member?.email,
          memberConversationsLink,
        );
      }

      await Message.updateMany(
        { _id: { $in: unreadMessages.map((m) => m._id) } },
        { $set: { notified: true } },
      );
    }
  }
};

const notifyCreatorsWithUnreadMessages = async () => {
  const creators = await Creator.find({ isArchived: false });

  for (const creator of creators) {
    const unreadMessages = await getUnreadMessagesOlderThanOneDay(creator._id);

    if (unreadMessages.length > 0) {
      if (creator?.emailNotification) {
        const creatorConversationsLink = `${process.env.CLIENT_URL}/creators/messages`;
        emailService.notifyUserForUnreadMessage(
          creator?.email,
          creatorConversationsLink,
        );
      }

      await Message.updateMany(
        { _id: { $in: unreadMessages.map((m) => m._id) } },
        { $set: { notified: true } },
      );
    }
  }
};

module.exports = {
  notifyMembersWithUnreadMessages,
  notifyCreatorsWithUnreadMessages,
};
