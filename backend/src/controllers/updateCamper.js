const { MongoClient } = require('mongodb');
const { increment, decrease, incrementWithSession } = require('../connection/autoincrement.js');
require('dotenv').config();

const uri = process.env.DDBB256;
const nombreBase = 'proyectCv';

async function putCamper(camperData, CV, socialData, camperId) {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const session = client.startSession();
    await session.startTransaction();

    try {
      const db = client.db(nombreBase);
      camperId = parseInt(camperId);
      convertData(camperData);

      camperData = { ...camperData, Working: false };
      await validateAndUpdate('Campers', db, '_id', camperId, camperData, session);

      const cvData = { Name: CV.name, Pdf: CV.data, ContentType: "application/pdf" };
      await validateAndUpdate('CVs', db, 'CamperId', camperId, cvData, session);

      await validateAndUpdate('Social_Network', db, 'CamperId', camperId, socialData, session);

      await session.commitTransaction();
      const result = { status: 201, message: `Camper identificado con el Id ${camperId} se ha actualizado correctamente` };
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


async function convertData(camperData){
  const convertToNumber = (field) => !isNaN(camperData[field]) ? Number(camperData[field]) : camperData[field];
  const convertToArray = (field) => {
    try {
      return JSON.parse(camperData[field]);
    } catch (error) {
      console.error(`Error parsing field '${field}': ${error.message}`);
      return camperData[field];
    }
  };
  const numericFields = ['Salary', 'EnglishLevel', 'Gender', 'TypeDocument', 'identification'];
  const arrayFields = ['Skills', 'Stacks'];

  numericFields.forEach(field => camperData[field] = convertToNumber(field));
  arrayFields.forEach(field => camperData[field] = convertToArray(field));

}

async function validateAndUpdate(collectionName, db, parameter, id, data, session) {
    const validationResult = await db.command({
        validate: collectionName,
        documents: [{ [parameter]: id }],
    });
    
    const validationResult2 = await db.command({
        validate: collectionName,
        documents: [data],
    });

    if (!validationResult.valid) {
        throw new Error(`Error validating document with ID ${numericId}`);
    } else {
        if (!validationResult2.valid) {
            throw new Error(`Error validating document with ID ${numericId}`);
        } else {
            const result = await db.collection(collectionName).updateOne({ [parameter]: id }, { $set: data }, { session });
            if (result.matchedCount === 0) {
              throw new Error(`${collectionName} identificado con el Id ${id} no existe`);
            }
        }
    }
}

module.exports = {
    putCamper,
    validateAndUpdate
};