module.exports = {
  async up(db, client) {
    const collection = db.collection('profilevisits');

    const cursor = collection.find({});
    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      await collection.updateOne(
        { _id: doc._id },
        {
          $rename: { creator: 'visitedUser', member: 'visitor' },
        },
      );
    }
  },

  async down(db, client) {},
};
