module.exports = {
  async up(db, client) {
    const collection = await db.collection('members');
    const cursor = collection.find();

    while (await cursor.hasNext()) {
      const doc = await cursor.next();

      const updates = {
        $set: {
          creditAmount: 0,
        },
      };

      await collection.updateOne({ _id: doc._id }, updates);
    }
  },

  async down(db, client) {},
};
