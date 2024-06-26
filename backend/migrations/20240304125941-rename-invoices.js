module.exports = {
  async up(db, client) {
    const collection = db.collection('invoices');

    const cursor = collection.find({});
    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      await collection.updateOne(
        { _id: doc._id },
        {
          $rename: { creator: 'user' },
        },
      );
    }
  },

  async down(db, client) {},
};
