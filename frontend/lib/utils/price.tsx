export const getMediaPrice = (price: any, salesFee = 0.2) => {
  if (isNaN(price)) return 0;

  const euroToCreditRate = 30 / 7.99;
  const salesMultiplicator = 1 + salesFee;

  let formattedPrice = parseFloat(price) * 100;

  let priceWithCommission = formattedPrice * salesMultiplicator;

  let priceInCredits = priceWithCommission * euroToCreditRate;

  priceInCredits = Math.ceil(priceInCredits / 100);

  return priceInCredits;
};

export const getCurrencySign = (currency: any) => {
  let sign = "";

  if (currency === "EUR") {
    sign = "€";
  }

  return sign;
};
