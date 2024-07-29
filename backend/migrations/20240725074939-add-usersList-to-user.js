module.exports = {
  async up(db, client) {
    const collection = db.collection('users');

    await collection.updateMany(
      {},
      {
        $set: { profileViewers: [], messageSenders: [], nudeBuyers: [] },
      },
    );
  },

  async down(db, client) {},
};
