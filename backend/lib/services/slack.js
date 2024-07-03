const { WebClient } = require('@slack/web-api');
const config = require('../../config');

const token = config.slackToken;
const conversationId = 'C05JFTUQ6N7';
const conversationErrorId = 'C05T3CCQEG6';

const web = new WebClient(token);

const notifySlack = async (text) => {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  try {
    await web.chat.postMessage({
      channel: conversationId,
      text: text,
      mrkdwn: false,
    });
  } catch (error) {
    console.error(error);
  }
};

const notifyErrorSlack = async (text) => {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  try {
    await web.chat.postMessage({
      channel: conversationErrorId,
      text: text,
      mrkdwn: false,
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  notifySlack,
  notifyErrorSlack,
};
