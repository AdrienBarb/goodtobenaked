module.exports = {
  async up(db, client) {
    await db.collection('users').updateMany(
      { creditAmount: { $exists: true } },
      {
        $mul: { creditAmount: 2 },
      },
    );
  },

  async down(db, client) {
    await db.collection('users').updateMany(
      { creditAmount: { $exists: true } },
      {
        $mul: { creditAmount: 0.5 },
      },
    );
  },
};
