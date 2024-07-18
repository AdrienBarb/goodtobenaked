module.exports = {
  async up(db, client) {
    await db.collection('sales').updateMany({}, [
      {
        $set: {
          'amount.baseValue': '$amount.baseValueWithCommission',
          'amount.creditValue': '$amount.baseValueWithCommission',
        },
      },
    ]);

    await db.collection('sales').updateMany(
      {},
      {
        $unset: {
          'amount.commission': '',
          'amount.baseValueWithCommission': '',
        },
        $rename: {
          'amount.baseValue': 'amount.fiatValue',
        },
      },
    );
  },
};
