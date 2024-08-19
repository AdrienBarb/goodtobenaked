module.exports = {
  async up(db, client) {
    await db.collection('sales').updateMany(
      { 'amount.creditValue': { $exists: true } },
      {
        $mul: { 'amount.creditValue': 2 },
      },
    );
  },

  async down(db, client) {
    await db.collection('sales').updateMany(
      { 'amount.creditValue': { $exists: true } },
      {
        $mul: { 'amount.creditValue': 0.5 },
      },
    );
  },
};
