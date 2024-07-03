const mongoose = require('mongoose');
const initializeConfigurations = require('../lib/utils/db/initializeConfigurations');
const config = require('../config');

const connectionUrl = config.mongodbUri;

// Connecter à la base de données seulement si l'environnement n'est pas 'test'
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(connectionUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Successfully connected to MongoDB.');

      initializeConfigurations().then(() => {
        console.log('Configurations successfully initialized');
      });
    })
    .catch((e) => {
      console.error('Connection error', e.message);
    });
}

const db = mongoose.connection;

/**
 * Exécute une fonction donnée dans le cadre d'une transaction MongoDB.
 * @param {Function} fn - La fonction à exécuter dans la transaction.
 * @returns {Promise} - Le résultat de la fonction exécutée.
 */
async function executeInTransaction(fn) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const result = await fn(session); // Exécution de la fonction avec la session
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
}

module.exports = { db, executeInTransaction };
