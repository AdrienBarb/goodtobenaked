module.exports = {
  async up(db, client) {
    const conversationCollection = await db.collection('conversations');
    const cursor = conversationCollection.find();

    while (await cursor.hasNext()) {
      const doc = await cursor.next();

      const updates = {
        $set: {
          isArchived: false,
        },
      };

      await conversationCollection.updateOne({ _id: doc._id }, updates);
    }
  },

  async down(db, client) {},
};
