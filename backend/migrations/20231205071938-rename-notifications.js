const { default: mongoose } = require('mongoose');

module.exports = {
  async up(db, client) {
    const notificationCollection = await db.collection('notifications');
    const cursor = notificationCollection.find();

    while (await cursor.hasNext()) {
      const doc = await cursor.next();

      const updates = {
        $set: {
          fromUser: doc.fromUser
            ? mongoose.Types.ObjectId(doc.fromUser)
            : undefined,
          targetUser: mongoose.Types.ObjectId(doc.targetUser),
        },
        $unset: {
          fromUserRole: 1,
          targetUserRole: 1,
          product: 1,
          order: 1,
        },
      };

      await notificationCollection.updateOne({ _id: doc._id }, updates);
    }
  },

  async down(db, client) {},
};
