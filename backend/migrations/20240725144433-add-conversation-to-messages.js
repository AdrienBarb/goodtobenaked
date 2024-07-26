// Exemple de fichier de migration généré : add-conversationId-to-messages.js
module.exports = {
  async up(db, client) {
    // Ajouter le champ conversationId à tous les documents de la collection messages
    await db.collection('messages').updateMany(
      {},
      {
        $set: {
          conversation: null,
        },
      },
    );

    // Récupérer toutes les conversations pour mettre à jour les messages existants
    const conversations = await db.collection('conversations').find().toArray();

    for (const conversation of conversations) {
      if (conversation.messages && conversation.messages.length > 0) {
        // Mettre à jour chaque message avec le conversationId correspondant
        await db.collection('messages').updateMany(
          {
            _id: { $in: conversation.messages },
          },
          {
            $set: {
              conversation: conversation._id,
            },
          },
        );
      }
    }
  },

  async down(db, client) {
    // Retirer le champ conversationId de tous les documents de la collection messages
    await db.collection('messages').updateMany(
      {},
      {
        $unset: {
          conversation: '',
        },
      },
    );
  },
};
