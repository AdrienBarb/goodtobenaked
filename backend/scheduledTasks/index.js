var cron = require('node-cron');
const moment = require('moment');
const emailService = require('../lib/email');
const Creator = require('../models/creatorModel');
const {
  notifyMembersWithUnreadMessages,
  notifyCreatorsWithUnreadMessages,
} = require('../lib/notification/notifyUsersWithUnreadMessages');
const config = require('../config');

const notifyVerifiedProfile = () => {
  const notifyVerifiedProfileScheduledJobFunction = cron.schedule(
    '0 12 * * *',
    async () => {
      const creators = await Creator.find({
        verified: { $ne: 'verified' },
        isArchived: false,
      });

      const signInLink = `${config.clientUrl}/en/login`;

      await Promise.all(
        creators.forEach(async (currentCreator) => {
          if (currentCreator?.completionProfilNotification) {
            return;
          }

          let now = moment();
          let registrationDate = moment(currentCreator.createdAt);
          let daysSinceRegistration = now.diff(registrationDate, 'days');

          if (daysSinceRegistration >= 3) {
            emailService.notifyCreatorToCompleteHisProfile(
              currentCreator?.email,
              signInLink,
            );
            await Creator.updateOne(
              { _id: currentCreator?._id },
              { completionProfilNotification: true },
            );
          }
        }),
      );
    },
  );

  notifyVerifiedProfileScheduledJobFunction.start();
};

//Notify member and creator for their unread message
const notifyUsersForUnreadMessages = () => {
  const notifyUsersForUnreadMessagesScheduledJobFunction = cron.schedule(
    '0 12 * * *',
    async () => {
      try {
        await notifyMembersWithUnreadMessages();
        await notifyCreatorsWithUnreadMessages();
      } catch (error) {
        console.error(error);
      }
    },
  );

  notifyUsersForUnreadMessagesScheduledJobFunction.start();
};

const notifyReferral = () => {
  const notifyReferralScheduledJobFunction = cron.schedule(
    '0 12 15 * *',
    async () => {
      const creators = await Creator.find({
        verified: 'verified',
        isArchived: false,
      });
      const signInLink = `${config.clientUrl}/fr/dashboard/account/referral`;

      await Promise.all(
        creators.forEach(async (currentCreator) => {
          emailService.notifyReferral(
            currentCreator?.email,
            currentCreator?.pseudo,
            signInLink,
          );
        }),
      );
    },
  );

  notifyReferralScheduledJobFunction.start();
};

module.exports = {
  notifyUsersForUnreadMessages,
  notifyReferral,
  notifyVerifiedProfile,
};
