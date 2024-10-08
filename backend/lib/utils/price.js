const getMediaPrice = (price) => {
  if (isNaN(price)) return 0;

  const formattedPrice = parseFloat(price) * 100;
  const roundedPrice = Math.round(formattedPrice);

  return {
    fiatPrice: roundedPrice,
    creditPrice: roundedPrice * 2,
  };
};

const getPriceInFiatFromCredits = (creditPrice) => {
  if (isNaN(creditPrice)) return 0;

  const formatted = parseFloat(creditPrice) * 100;
  const rounded = Math.round(formatted);

  return {
    fiatPrice: rounded / 2,
    creditPrice: rounded,
  };
};

module.exports = {
  getMediaPrice,
  getPriceInFiatFromCredits,
};
