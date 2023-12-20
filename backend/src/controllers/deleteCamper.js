const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.DDBB256;
const nombreBase = 'proyectCv';

async function deleteCamper(camperId) {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const session = client.startSession();
    await session.startTransaction();
    const numericItemId = parseInt(camperId);
    try {
        const db = client.db(nombreBase);
    
        await validateAndDelete('Campers', db, "_id", numericItemId, session);
        await validateAndDelete('CVs', db, "CamperId", numericItemId, session);
        await validateAndDelete('Social_Network', db, "CamperId", numericItemId, session);

      await session.commitTransaction();
      const result = { status: 200, message: `Camper identificado con el Id ${numericItemId} se ha eliminado correctamente` };
      return result;

    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    throw error;
  } finally {
    client.close();
  }
}

async function validateAndDelete(collectionName, db, parameter, id, session) {
    const validationResult = await db.command({
        validate: collectionName,
        documents: [{ [parameter]: id }],
    });
    
    if (!validationResult.valid) {
        throw new Error(`Error validating document with ID ${numericId}`);
    } else {
        const result = await db.collection(collectionName).deleteOne({ [parameter]: id }, { session });
        if (result.deletedCount === 0) {
          throw new Error(`Camper identificado con el Id ${id} no existe`);
        }
    }
  }
module.exports = {
    deleteCamper
};