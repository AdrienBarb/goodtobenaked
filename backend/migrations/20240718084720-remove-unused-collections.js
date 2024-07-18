module.exports = {
  async up(db, client) {
    await db.collection('categories').drop();
    await db.collection('comments').drop();
    await db.collection('commissions').drop();
    await db.collection('creators').drop();
    await db.collection('members').drop();
    await db.collection('creatortokens').drop();
    await db.collection('imagecontents').drop();
    await db.collection('mediasolds').drop();
    await db.collection('membertokens').drop();
    await db.collection('nudesolds').drop();
    await db.collection('options').drop();
    await db.collection('orderactivities').drop();
    await db.collection('orders').drop();
    await db.collection('packages').drop();
    await db.collection('privateservices').drop();
    await db.collection('products').drop();
    await db.collection('refunds').drop();
    await db.collection('reviews').drop();
    await db.collection('serviceorders').drop();
    await db.collection('services').drop();
    await db.collection('shippingfees').drop();
    await db.collection('stories').drop();
    await db.collection('subcategories').drop();
    await db.collection('subscriptions').drop();
  },

  async down(db, client) {},
};
