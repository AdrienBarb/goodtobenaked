const Comission = require('../../models/comissionModel');
const { getRoundedNumber } = require('../utils');

const createProductComission = async (referrerId, sellerId, product) => {
  try {
    if (!referrerId || !sellerId || !product) {
      throw new Error('Missing argument');
    }

    const comission = getRoundedNumber(product?.price * 0.05);

    await Comission.create({
      referrer: referrerId,
      seller: sellerId,
      commissionAmount: comission,
    });
  } catch (error) {
    console.error('Error creating comissions ', error);
    throw error;
  }
};

module.exports = {
  createProductComission,
};
