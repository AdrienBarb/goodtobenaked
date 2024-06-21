const saleModel = require('../../models/saleModel');

const getUserIncomes = async (owner) => {
  try {
    const nudeSales = await saleModel.find({
      owner: owner,
      saleType: 'nude',
      isPaid: false,
    });
    const commissionSales = await saleModel.find({
      owner: owner,
      saleType: 'commission',
      isPaid: false,
    });
    const tipSales = await saleModel.find({
      owner: owner,
      saleType: 'tip',
      isPaid: false,
    });

    return [
      {
        label: 'Ventes de medias',
        salesCount: nudeSales.length,
        salesAmount:
          nudeSales.reduce(
            (acc, currentValue) => acc + currentValue.amount.baseValue,
            0,
          ) / 100,
      },
      {
        label: 'Commissions parrainage',
        salesCount: commissionSales.length,
        salesAmount:
          commissionSales.reduce(
            (acc, currentValue) => acc + currentValue.amount.baseValue,
            0,
          ) / 100,
      },
      {
        label: 'Pourboires',
        salesCount: tipSales.length,
        salesAmount:
          tipSales.reduce(
            (acc, currentValue) => acc + currentValue.amount.baseValue,
            0,
          ) / 100,
      },
    ];
  } catch (error) {
    console.error('Error getIncomes ', error);
    throw error;
  }
};

module.exports = {
  getUserIncomes,
};
