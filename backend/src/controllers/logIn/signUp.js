const { MongoClient } = require('mongodb');
const { sendEmail } = require('../../middleware/emailControllers.js');
const { validateAndCreate } = require('../postCamper.js');
const { increment, decrease, incrementWithSession } = require('../../connection/autoincrement.js');
const { validateCredentialsNewCamper } = require('../../middleware/validateNewCamper.js');
require('dotenv').config();

const uri = process.env.DDBB256;
const nombreBase = 'proyectCv';


async function SignUp(userData, companyData) {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const session = client.startSession();
    await session.startTransaction();

    try {
      const db = client.db(nombreBase);
      await validateCredentialsNewCamper(db, userData, session);
      const idU = await incrementWithSession('User', session, db);
      userData = { ...userData, _id: idU };
      await validateAndCreate('User', db, userData, session);

      if (userData.Role === "Company") {
        const idD = await incrementWithSession('Data_User', session, db);
        companyData = { ...companyData, _id: idD, UserId: idU };
        await validateAndCreate('Data_User', db, companyData, session);
      }
      await session.commitTransaction();
      const result = { status: 201, message: `El usuario se ha creado correctamente` };
      sendEmail(userData, "User Creation", "SignUp");
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

module.exports = {
    SignUp
};