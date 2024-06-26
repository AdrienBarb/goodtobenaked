module.exports = {
  async up(db, client) {
    try {
      const commissions = await db.collection('commissions').find().toArray();

      for (const currentCommission of commissions) {
        await db.collection('sales').insertOne({
          owner: currentCommission.referrer,
          fromUser: currentCommission.seller.toString(),
          saleType: 'commission',
          isPaid: currentCommission.isPaid,
          createdAt: currentCommission.createdAt,
          updatedAt: currentCommission.updatedAt,
          amount: {
            baseValue: currentCommission.commissionAmount * 100,
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
