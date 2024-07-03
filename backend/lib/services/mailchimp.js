const Mailchimp = require('mailchimp-api-v3');
const config = require('../../config');

// Replace with your API key
const mailchimp = new Mailchimp(config.mailchimpApiKey);

const subscribeToMailchimp = async (email) => {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  try {
    await mailchimp.post(`/lists/9f32bb02e9/members`, {
      email_address: email,
      status: 'subscribed',
      tags: ['vendeurs'],
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  subscribeToMailchimp,
};
