const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.DDBB256;
const nombreBase = 'proyectCv';

async function hiringCamper(collectionName, itemId) {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db(nombreBase);
        const collection = db.collection(collectionName);
        const numericItemId = parseInt(itemId);
        const user = await collection.findOne({ _id: numericItemId });

        if (!user) {
            throw new Error(`Elemento con ID ${itemId} no encontrado en ${collectionName}`);
        }
        const updatedWorkingStatus = !user.Working;
        const result = await collection.updateOne(
            { _id: numericItemId },
            { $set: { Working: updatedWorkingStatus } }
        );

        if (result.matchedCount === 0) {
            throw new Error(`Elemento con ID ${itemId} no encontrado en ${collectionName}`);
        }

        return { message: `Estado de trabajo del usuario con ID ${itemId} actualizado correctamente` };
    } catch (error) {
        console.error(error.message);
        throw error;
    } finally {
        client.close();
    }
}

module.exports = {
    hiringCamper
};
