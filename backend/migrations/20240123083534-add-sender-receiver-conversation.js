const { default: mongoose } = require('mongoose');

module.exports = {
  async up(db, client) {
    const conversationCollection = await db.collection('conversations');
    const cursor = conversationCollection.find();

    while (await cursor.hasNext()) {
      const doc = await cursor.next();

      const participants = [
        mongoose.Types.ObjectId(doc.creator),
        mongoose.Types.ObjectId(doc.member),
      ];

      const updates = {
        $set: {
          participants: participants,
        },
        $unset: {
          creator: 1,
          member: 1,
        },
      };

      await conversationCollection.updateOne({ _id: doc._id }, updates);
    }
  },

  async down(db, client) {
    // La logique pour revenir en arrière (down) si nécessaire
  },
};
