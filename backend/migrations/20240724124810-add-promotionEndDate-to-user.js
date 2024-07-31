const moment = require('moment');

module.exports = {
  async up(db, client) {
    const usersCollection = await db.collection('users');
    const cursor = usersCollection.find();

    while (await cursor.hasNext()) {
      const user = await cursor.next();

      if (!user.promotionEndDate) {
        const createdAt = user.createdAt;

        if (!createdAt) {
          continue;
        }

        const promotionEndDate = moment(createdAt)
          .add(3, 'months')
          .startOf('day')
          .toDate();

        const updates = {
          $set: {
            promotionEndDate: promotionEndDate,
          },
        };

        await usersCollection.updateOne({ _id: user._id }, updates);
      }
    }
  },

  async down(db, client) {
    const usersCollection = await db.collection('users');

    await usersCollection.updateMany(
      { promotionEndDate: { $exists: true } },
      { $unset: { promotionEndDate: '' } },
    );
  },
};
