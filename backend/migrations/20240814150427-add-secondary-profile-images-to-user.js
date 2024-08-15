module.exports = {
  async up(db, client) {
    // Ajouter le champ secondaryProfileImages avec une valeur par défaut d'un array vide
    await db.collection('users').updateMany(
      {},
      {
        $set: {
          secondaryProfileImages: [],
        },
      },
    );

    // Ajouter le champ profileImage qui sera égal à image.profil
    await db
      .collection('users')
      .updateMany({ 'image.profil': { $exists: true } }, [
        {
          $set: {
            profileImage: '$image.profil',
          },
        },
      ]);
  },

  async down(db, client) {
    // Supprimer les champs secondaryProfileImages et profileImage
    await db.collection('users').updateMany(
      {},
      {
        $unset: {
          secondaryProfileImages: '',
          profileImage: '',
        },
      },
    );
  },
};
