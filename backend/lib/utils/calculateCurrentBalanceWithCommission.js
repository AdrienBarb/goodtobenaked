const calculateCurrentBalanceWithCommission = (sales) => {
  return sales.reduce((acc, sale) => {
    const netAmount = sale.amount.fiatValue * 0.8;
    return acc + netAmount;
  }, 0);
};

module.exports = calculateCurrentBalanceWithCommission;
