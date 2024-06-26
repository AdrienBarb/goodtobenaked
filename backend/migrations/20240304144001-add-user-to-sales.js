const { ObjectId } = require('mongodb');

module.exports = {
  async up(db, client) {
    const collection = db.collection('sales');

    const cursor = collection.find({});
    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      await collection.updateOne(
        { _id: doc._id },
        {
          $set: { fromUser: new ObjectId(doc.fromUser) },
        },
      );
    }
  },

  async down(db, client) {},
};
