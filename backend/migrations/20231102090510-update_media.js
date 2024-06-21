module.exports = {
  async up(db, client) {
    const mediaCollection = await db.collection('media');
    const cursor = mediaCollection.find({ isArchived: false });

    while (await cursor.hasNext()) {
      const doc = await cursor.next();

      const updates = {
        $set: {
          s3Key: {
            original: doc.mediaKey,
            preview: doc.previewMediaKey || doc.blurredMediaKey,
          },
          job: {
            convertId: doc.mediaConvertJobId,
            convertPreviewId: doc.mediaConvertPreviewJobId,
            error: false,
          },
        },
        $unset: {
          mediaKey: 1,
          previewMediaKey: 1,
          blurredMediaKey: 1,
          mediaConvertJobId: 1,
          mediaConvertPreviewJobId: 1,
          paidMembers: 1,
          description: 1,
          attachedProduct: 1,
          title: 1,
          price: 1,
          serviceFee: 1,
          serviceFeeVat: 1,
          totalPrice: 1,
          itPays: 1,
          visibilityType: 1,
          isPublished: 1,
        },
      };

      await mediaCollection.updateOne({ _id: doc._id }, updates);
    }
  },

  async down(db, client) {},
};
