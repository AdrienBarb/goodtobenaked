module.exports = {
  async up(db, client) {
    await db.collection('nudes').updateMany(
      { 'priceDetails.creditPrice': { $exists: true } },
      {
        $mul: { 'priceDetails.creditPrice': 2 },
      },
    );
  },

  async down(db, client) {
    await db.collection('nudes').updateMany(
      { 'priceDetails.creditPrice': { $exists: true } },
      {
        $mul: { 'priceDetails.creditPrice': 0.5 },
      },
    );
  },
};
