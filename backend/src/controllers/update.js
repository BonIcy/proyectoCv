const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.DDBB256;
const nombreBase = 'proyectCv';

async function updateData(collectionName, itemId, newData) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(nombreBase);
    const collection = db.collection(collectionName);
    const numericItemId = parseInt(itemId);
    const result = await collection.updateOne({ _id: numericItemId }, { $set: newData });

    if (result.matchedCount === 0) {
      throw new Error(`Elemento con ID ${itemId} no encontrado en ${collectionName}`);
    }

    return newData;
  } catch (error) {
    console.error(error.message);
    throw error;
  } finally {
    client.close();
  }
}

module.exports = {
  updateData
};
