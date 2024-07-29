const Mailchimp = require('mailchimp-api-v3');
const config = require('../../config');

const subscribeToMailchimp = async (email) => {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  const mailchimp = new Mailchimp(config.mailchimpApiKey);

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
