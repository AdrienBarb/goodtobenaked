const config = require('../../config');

const getRoundedNumber = (num) => {
  let formatedNum = num;

  if (typeof num === 'string') {
    formatedNum = parseFloat(num.replace(',', '.'));
  }

  return Math.round(formatedNum * 100) / 100;
};

const getCreatorOrderUrl = (orderId) => {
  return `${config.clientUrl}/creators/orders/${orderId}`;
};

const getMemberOrderUrl = (orderId) => {
  return `${config.clientUrl}/members/orders/${orderId}`;
};

const getCreatorServiceOrderUrl = (serviceOrderId) => {
  return `${config.clientUrl}/creators/service-orders/${serviceOrderId}`;
};

const getMemberServiceOrderUrl = (serviceOrderId) => {
  return `${config.clientUrl}/members/service-orders/${serviceOrderId}`;
};

const generateRandomCode = (length) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(Math.random() * (max - min + 1) + min);
};

module.exports = {
  getRoundedNumber,
  getCreatorOrderUrl,
  getMemberOrderUrl,
  generateRandomCode,
  getCreatorServiceOrderUrl,
  getMemberServiceOrderUrl,
};
