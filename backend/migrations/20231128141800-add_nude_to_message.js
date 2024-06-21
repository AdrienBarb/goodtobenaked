module.exports = {
  async up(db, client) {
    const messageCollection = await db.collection('messages');
    const cursor = messageCollection.find();

    while (await cursor.hasNext()) {
      const doc = await cursor.next();

      const updates = {
        $set: {
          nude: doc.media,
        },
        $unset: {
          media: 1,
        },
      };

      await messageCollection.updateOne({ _id: doc._id }, updates);
    }
  },

  async down(db, client) {},
};
