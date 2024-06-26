module.exports = {
  async up(db, client) {
    const euroToCreditRate = 30 / 7.99;

    try {
      const nudeSolds = await db
        .collection('nudesolds')
        .find({ status: 'succeeded' })
        .toArray();

      for (const currentNudeSold of nudeSolds) {
        let baseValueWithCommission =
          currentNudeSold.priceDetails.basePrice +
          currentNudeSold.priceDetails.serviceFee;
        let priceInCredits = baseValueWithCommission * euroToCreditRate;

        await db.collection('sales').insertOne({
          owner: currentNudeSold.seller,
          fromUser: currentNudeSold.buyer.toString(),
          saleType: 'nude',
          isPaid: currentNudeSold.haveBeenPaid,
          nude: currentNudeSold.nude.insertedId,
          createdAt: currentNudeSold.createdAt,
          updatedAt: currentNudeSold.updatedAt,
          amount: {
            baseValue: currentNudeSold.priceDetails.basePrice,
            commission: currentNudeSold.priceDetails.serviceFee,
            baseValueWithCommission: baseValueWithCommission,
            creditValue: Math.ceil(priceInCredits / 100),
            currency: 'EUR',
          },
        });
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  async down(db, client) {
    await db.collection('nudes').deleteMany({});
  },
};
