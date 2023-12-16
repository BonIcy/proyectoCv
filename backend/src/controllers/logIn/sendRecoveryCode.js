const { MongoClient } = require('mongodb');
const { sendEmail } = require('../../middleware/emailControllers.js');
const { validateAndCreate } = require('../postCamper.js');
const { incrementWithSession } = require('../../connection/autoincrement.js');
const { validateCredentialsRecoveryUser } = require('../../middleware/validateRecoveryUser.js');
require('dotenv').config();

const uri = process.env.DDBB256;
const nombreBase = 'proyectCv';


async function sendRecoveryCode(userData) {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const session = client.startSession();
    await session.startTransaction();

    try {
        const db = client.db(nombreBase);
        await validateCredentialsRecoveryUser(db, userData, session);
        userData = {...userData, CreatedAt: new Date(), Recovery_Code: generateCode()};
        console.log(userData);
        
        let update = await db.collection('PasswordCode').findOne({ Username : userData.Username, Email : userData.Email }, {session});
        if (!update) {
            const idP = await incrementWithSession('PasswordCode', session, db);
            await db.collection('PasswordCode').insertOne({...userData, _id: idP}, {session});
        } else {
            await db.collection('PasswordCode').findOneAndUpdate({ Username : userData.Username, Email : userData.Email },{$set: { Recovery_Code : userData.Recovery_Code}}, {session})
        }
     
        await session.commitTransaction();
        const result = {status: 200, 
            message: `Recovery code created, check your inbox to find the email, if you can't find it, check your spam folder.`, 
            creation_date: userData.CreatedAt, code: userData.Recovery_Code, user: userData.Username
        };
        sendEmail(userData, "Password Change Request", "RecoveryPassword");
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

function generateCode() {
    const charactersAllowed = '0123456789!@#$%^&*abcdefghijklmnopqrstuvwxyz?';
    const length = 5;
    let code = '';
  
    for (let i = 0; i < length; i++) {
      const indexRandom = Math.floor(Math.random() * charactersAllowed.length);
      code += charactersAllowed.charAt(indexRandom);
    }
  
    return code;
}

module.exports = {
    sendRecoveryCode
};