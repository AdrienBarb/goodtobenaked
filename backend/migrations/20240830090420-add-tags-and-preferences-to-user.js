module.exports = {
  async up(db, client) {
    // Ajouter le champ secondaryProfileImages avec une valeur par défaut d'un array vide
    await db.collection('users').updateMany(
      {},
      {
        $set: {
          preferences: [],
          tags: [],
        },
      },
    );
  },

  async down(db, client) {},
};
