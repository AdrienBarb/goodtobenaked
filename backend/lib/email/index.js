const mailgun = require('mailgun-js');
const config = require('../../config');

const DOMAIN = config.mailGunBaseUrl;
const API_KEY = config.mailGunApiKey;
const FROM = 'Goodtobenaked@goodtobenaked.com';

console.log('process.env.NODE_ENV ', process.env.NODE_ENV);

const mg = mailgun({
  apiKey: API_KEY,
  domain: DOMAIN,
  host: 'api.eu.mailgun.net',
});

const sendResetPasswordEmail = (email, link) => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  const data = {
    from: FROM,
    to: email,
    subject: 'Réinitialisation de votre mot de passe',
    template: 'reset-password',
    'v:link': link,
  };

  mg.messages().send(data, function (error, body) {
    console.log('BODY ', body);
  });
};

const sendCreatorEmailVerification = (email, link) => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  if (process.env.NODE_ENV === 'dev') {
    return;
  }

  const data = {
    from: FROM,
    to: email,
    subject: 'Confirmation de votre adresse email',
    template: 'email-verification',
    'v:link': link,
  };

  mg.messages().send(data, function (error, body) {
    console.log('BODY ', body);
  });
};

//Done

const sendCreatorAccountVerificationUpdate = (email, state, link) => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  if (process.env.NODE_ENV === 'dev') {
    return;
  }

  let data = {
    from: FROM,
    to: email,
    subject: 'Félicitations, votre compte est activé !',
    template: 'account-verified',
    'v:link': link,
  };

  if (state === 'rejected') {
    data = {
      from: FROM,
      to: email,
      subject: 'Votre demande de compte a été refusée',
      template: 'account-rejected',
    };
  }

  mg.messages().send(data, function (error, body) {
    console.log('BODY ', body);
  });
};

//When creator edit his password
const editCreatorPassword = (email) => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  if (process.env.NODE_ENV === 'dev') {
    return;
  }

  let data = {
    from: FROM,
    to: email,
    subject: 'Votre mot de passe a bien été modifié !',
    template: 'edit-creator-password',
  };

  mg.messages().send(data, function (error, body) {
    console.log('BODY ', body);
  });
};

const sendPayInvoice = (email) => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  if (process.env.NODE_ENV === 'dev') {
    return;
  }

  const data = {
    from: FROM,
    to: email,
    subject: 'Votre facture a été payée !',
    template: 'pay-invoice',
  };

  mg.messages().send(data, function (error, body) {
    console.log('BODY ', body);
  });
};

const creatorAskPayment = (email) => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  if (process.env.NODE_ENV === 'dev') {
    return;
  }

  const data = {
    from: FROM,
    to: email,
    subject: 'Votre demande de paiement !',
    template: 'ask-payment',
  };

  mg.messages().send(data, function (error, body) {
    console.log('BODY ', body);
  });
};

const notifyCreatorToCompleteHisProfile = (email, link) => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  if (process.env.NODE_ENV === 'dev') {
    return;
  }

  const data = {
    from: FROM,
    to: email,
    subject: 'Complétez votre profil !',
    template: 'complete-your-profile',
    'v:link': link,
  };

  mg.messages().send(data, function (error, body) {
    console.log('BODY ', body);
  });
};

const notifyUserForUnreadMessage = (email, link) => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  if (process.env.NODE_ENV === 'dev') {
    return;
  }

  const data = {
    from: FROM,
    to: email,
    subject: 'Vous avez des messages non lus sur notre plateforme !',
    template: 'unread-messages',
    'v:link': link,
  };

  mg.messages().send(data, function (error, body) {
    console.log('BODY ', body);
  });
};

const notifyCreatorForMissingBankDetails = (email) => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  if (process.env.NODE_ENV === 'dev') {
    return;
  }

  const data = {
    from: FROM,
    to: email,
    subject: 'Nous avons tenté de vous faire un virement !',
    template: 'missing-bank-details',
  };

  mg.messages().send(data, function (error, body) {
    console.log('BODY ', body);
  });
};

const sendVerificationCode = (email, code) => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  const data = {
    from: FROM,
    to: email,
    subject: 'Votre code de vérification !',
    template: 'verification-code',
    'v:code': code,
  };

  mg.messages().send(data, function (error, body) {
    console.log('BODY ', body);
  });
};

const notifyReferral = (email, pseudo, link) => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  if (process.env.NODE_ENV === 'dev') {
    return;
  }

  const data = {
    from: FROM,
    to: email,
    subject: "Gagnez de l'argent en parrainant vos amis !",
    template: 'referral',
    'v:pseudo': pseudo,
    'v:link': link,
  };

  mg.messages().send(data, function (error, body) {
    console.log('BODY ', body);
  });
};

module.exports = {
  sendResetPasswordEmail,
  sendCreatorEmailVerification,
  sendCreatorAccountVerificationUpdate,
  editCreatorPassword,
  sendPayInvoice,
  creatorAskPayment,
  notifyCreatorToCompleteHisProfile,
  notifyUserForUnreadMessage,
  notifyCreatorForMissingBankDetails,
  sendVerificationCode,
  notifyReferral,
};
