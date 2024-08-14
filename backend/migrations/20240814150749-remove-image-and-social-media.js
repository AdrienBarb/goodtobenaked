module.exports = {
  async up(db, client) {
    // Supprimer le champ image et le champ socialMediaLink
    await db.collection('users').updateMany(
      {},
      {
        $unset: {
          image: '',
          socialMediaLink: '',
        },
      },
    );
  },

  async down(db, client) {
    // Restaurer les champs image et socialMediaLink avec des valeurs par défaut
    await db.collection('users').updateMany(
      {},
      {
        $set: {
          image: {
            profil: null,
            banner: null,
          },
          socialMediaLink: {
            twitter: null,
            instagram: null,
            mym: null,
            onlyfans: null,
          },
        },
      },
    );
  },
};
