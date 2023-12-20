const { MongoClient } = require('mongodb');
const { sendEmail } = require('../../middleware/emailControllers.js');
const { incrementWithSession } = require('../../connection/autoincrement.js');
const { validateCredentialsNewPassword } = require('../../middleware/validateNewPassword.js');
require('dotenv').config();

const uri = process.env.DDBB256;
const nombreBase = 'proyectCv';


async function recoveryPassword(userData) {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const session = client.startSession();
    await session.startTransaction();

    try {
        const db = client.db(nombreBase);

        await validateCredentialsNewPassword(db, userData, session);
        await db.collection('User').findOneAndUpdate({ Username : userData.Username, Email : userData.Email },{$set: { Password : userData.NewPassword}}, {session})
        await session.commitTransaction();
        const result = {
            status: 200, 
            message: `Password updated`, 
            Username: userData.Username
        };

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
    recoveryPassword
};