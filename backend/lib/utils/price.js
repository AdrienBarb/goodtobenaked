const getMediaPrice = (price) => {
  if (isNaN(price)) return 0;

  const formattedPrice = parseFloat(price) * 100;
  const roundedPrice = Math.round(formattedPrice);

  return {
    fiatPrice: roundedPrice,
    creditPrice: roundedPrice,
  };
};

const getPriceInFiatFromCredits = (creditPrice, salesFee = 0.2) => {
  if (isNaN(creditPrice)) return 0;

  const euroToCreditRate = 30 / 7.99;

  let priceInEuros = (creditPrice * 100) / euroToCreditRate;

  let formattedPrice = priceInEuros / (1 + salesFee);

  let commission = formattedPrice * salesFee;

  return {
    basePrice: Math.round(formattedPrice),
    basePriceWithCommission: Math.round(priceInEuros),
    commission: Math.round(commission),
    creditPrice: creditPrice,
  };
};

module.exports = {
  getMediaPrice,
  getPriceInFiatFromCredits,
};
