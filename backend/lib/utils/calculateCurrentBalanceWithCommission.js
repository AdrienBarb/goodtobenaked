const moment = require('moment');
const saleModel = require('../../models/saleModel');

const calculateCurrentBalanceWithCommission = async (user) => {
  const sales = await saleModel.find({ owner: user, isPaid: false });

  console.log('sales ', sales);

  const isUserInPromotionPeriod = moment().isBefore(
    moment(user.promotionEndDate),
  );

  const availableSales = sales.filter((sale) =>
    moment().isAfter(moment(sale.availableDate)),
  );
  const pendingSales = sales.filter((sale) =>
    moment().isBefore(moment(sale.availableDate)),
  );

  const calculateAmount = (salesList) => {
    return salesList.reduce((acc, sale) => {
      const netAmount = isUserInPromotionPeriod
        ? sale.amount.fiatValue
        : sale.amount.fiatValue * 0.8;
      return acc + netAmount;
    }, 0);
  };

  const availableAmount = calculateAmount(availableSales);
  const pendingAmount = calculateAmount(pendingSales);

  return {
    available: availableAmount,
    pending: pendingAmount,
  };
};

module.exports = calculateCurrentBalanceWithCommission;
