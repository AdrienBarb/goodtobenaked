const moment = require('moment');

const calculateCurrentBalanceWithCommission = (sales, user) => {
  const isUserInPromotionPeriod = moment().isBefore(
    moment(user.promotionEndDate),
  );

  return sales.reduce((acc, sale) => {
    const netAmount = isUserInPromotionPeriod
      ? sale.amount.fiatValue
      : sale.amount.fiatValue * 0.8;
    return acc + netAmount;
  }, 0);
};

module.exports = calculateCurrentBalanceWithCommission;
