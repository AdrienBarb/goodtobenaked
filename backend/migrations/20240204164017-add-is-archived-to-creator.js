module.exports = {
  async up(db, client) {
    const collections = await db.collection('creators');
    const cursor = collections.find();

    while (await cursor.hasNext()) {
      const doc = await cursor.next();

      const updates = {
        $set: {
          isArchived: false,
        },
      };

      await collections.updateOne({ _id: doc._id }, updates);
    }
  },

  async down(db, client) {},
};
