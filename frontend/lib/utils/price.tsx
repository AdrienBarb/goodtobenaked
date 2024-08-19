export const getMediaPrice = (price: any) => {
  if (isNaN(price)) return 0;

  let formattedPrice = parseFloat(price) * 2;

  return formattedPrice;
};

export const getCurrencySign = (currency: any) => {
  let sign = "";

  if (currency === "EUR") {
    sign = "€";
  }

  return sign;
};
