const moment = require('moment');

module.exports = {
  async up(db, client) {
    const salesCollection = await db.collection('sales');
    const cursor = salesCollection.find();

    while (await cursor.hasNext()) {
      const sale = await cursor.next();

      if (!sale.availableDate) {
        const createdAt = sale.createdAt;

        if (!createdAt) {
          continue;
        }

        const availableDate = moment(createdAt)
          .add(7, 'days')
          .startOf('day')
          .toDate();

        const updates = {
          $set: {
            availableDate: availableDate,
          },
        };

        await salesCollection.updateOne({ _id: sale._id }, updates);
      }
    }
  },

  async down(db, client) {
    const salesCollection = await db.collection('sales');

    await salesCollection.updateMany(
      { promotionEndDate: { $exists: true } },
      { $unset: { promotionEndDate: '' } },
    );
  },
};
