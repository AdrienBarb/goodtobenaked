module.exports = {
  async up(db, client) {
    const collection = db.collection('media');

    await collection.updateMany(
      {},
      {
        $set: { status: 'ready' },
      },
    );
  },

  async down(db, client) {},
};
