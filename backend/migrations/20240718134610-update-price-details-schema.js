module.exports = {
  async up(db, client) {
    await db.collection('nudes').updateMany({}, [
      {
        $set: {
          'priceDetails.basePrice': '$priceDetails.basePriceWithCommission',
          'priceDetails.creditPrice': '$priceDetails.basePriceWithCommission',
        },
      },
    ]);

    await db.collection('nudes').updateMany(
      {},
      {
        $unset: {
          'priceDetails.commission': '',
          'priceDetails.basePriceWithCommission': '',
        },
        $rename: {
          'priceDetails.basePrice': 'priceDetails.fiatPrice',
        },
      },
    );
  },
};
