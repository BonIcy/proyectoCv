const { MongoClient } = require('mongodb');
const { increment, decrease, incrementWithSession } = require('../connection/autoincrement.js');
require('dotenv').config();

const uri = process.env.DDBB256;
const nombreBase = 'proyectCv';

async function postCamper(camperData, CV, socialData) {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const session = client.startSession();
    await session.startTransaction();

    try {
      const db = client.db(nombreBase);

      convertData(camperData);
      const idC = await incrementWithSession('Campers', session, db);
      camperData = { ...camperData, _id: idC, Working: false };
      await validateAndCreate('Campers', db, camperData, session);

      const idCv = await incrementWithSession('CVs', session, db);
      const cvData = { _id: idCv, CamperId: idC, Name: CV.name, Pdf: CV.data, ContentType: "application/pdf" };
      await validateAndCreate('CVs', db, cvData, session);

      const idSn = await incrementWithSession('Social_Network', session, db);
      socialData = { _id: idSn, CamperId: idC, ...socialData };
      await validateAndCreate('Social_Network', db, socialData, session);

      await session.commitTransaction();
      const result = { status: 201, message: `Camper identificado con el Id ${idC} se ha creado correctamente` };
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

async function validateAndCreate(collectionName, db, data, session) {
  const validationResult = await db.command({
    validate: collectionName,
    documents: [data],
  });

  if (!validationResult.valid) {
    throw validationResult;
  } else {
    const Result = await db.collection(collectionName).insertOne(data, { session });
  }
}

module.exports = {
    postCamper,
    validateAndCreate
};