module.exports = {
  async up(db, client) {
    const collection = await db.collection('nudes');
    const cursor = collection.find();
    const euroToCreditRate = 30 / 7.99;

    while (await cursor.hasNext()) {
      const doc = await cursor.next();

      let updates;

      if (doc?.priceDetails?.basePrice) {
        let priceWithCommission =
          doc.priceDetails.basePrice + doc.priceDetails.serviceFee;
        let priceInCredits = priceWithCommission * euroToCreditRate;

        updates = {
          $set: {
            'priceDetails.basePriceWithCommission': priceWithCommission,
            'priceDetails.creditPrice': Math.ceil(priceInCredits / 100),
            'priceDetails.commission': doc.priceDetails.serviceFee,
            'priceDetails.currency': 'EUR',
          },
          $unset: {
            'priceDetails.serviceFee': 1,
            'priceDetails.serviceFeeVat': 1,
            'priceDetails.totalPrice': 1,
          },
        };
      } else {
        updates = {
          $set: {
            'priceDetails.basePrice': 0,
            'priceDetails.commission': 0,
            'priceDetails.basePriceWithCommission': 0,
            'priceDetails.creditPrice': 0,
            'priceDetails.currency': 'EUR',
          },
          $unset: {
            'priceDetails.serviceFee': 1,
            'priceDetails.serviceFeeVat': 1,
            'priceDetails.totalPrice': 1,
          },
        };
      }

      await collection.updateOne({ _id: doc._id }, updates);
    }
  },

  async down(db, client) {},
};
