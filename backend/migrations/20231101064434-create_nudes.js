module.exports = {
  async up(db, client) {
    try {
      const medias = await db
        .collection('media')
        .find({
          isPublished: true,
          $or: [
            {
              mediaConvertJobId: '',
              mediaConvertPreviewJobId: '',
              mediaType: 'video',
            },
            { mediaType: 'image' },
          ],
        })
        .toArray();

      for (const media of medias) {
        let priceDetails = {
          basePrice: media.price ? media.price * 100 : 0,
          serviceFee: media.serviceFee ? media.serviceFee * 100 : 0,
          serviceFeeVat: media.serviceFeeVat ? media.serviceFeeVat * 100 : 0,
          totalPrice: media.totalPrice ? media.totalPrice * 100 : 0,
        };

        const nude = await db.collection('nudes').insertOne({
          _id: media._id,
          user: media.creator,
          description: media.description,
          priceDetails: priceDetails,
          isArchived: media.isArchived ? media.isArchived : false,
          paidMembers: media.paidMembers ? media.paidMembers : [],
          isFree: media.itPays ? false : true,
          medias: [media?._id],
          visibility: 'public',
          createdAt: media.createdAt,
          updatedAt: media.updatedAt,
        });

        const mediaSolds = await db
          .collection('mediasolds')
          .find({ media: media._id })
          .toArray();

        for (const mediaSold of mediaSolds) {
          await db.collection('nudesolds').insertOne({
            seller: mediaSold.seller,
            buyer: mediaSold.buyer,
            priceDetails: priceDetails,
            nude: nude,
            haveBeenPaid: mediaSold.haveBeenPaid,
            status: 'succeeded',
            createdAt: mediaSold.createdAt,
            updatedAt: mediaSold.updatedAt,
          });
        }
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  async down(db, client) {
    await db.collection('nudes').deleteMany({});
  },
};
