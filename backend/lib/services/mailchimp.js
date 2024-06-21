const Mailchimp = require('mailchimp-api-v3');

// Replace with your API key
const mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY);

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
