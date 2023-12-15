const { MongoClient } = require('mongodb');
const { SignJWT } = require('jose');
const { validateCredentialsUser } = require('../../middleware/validateUser.js');
const { validateAndCreate } = require('../postCamper.js');
const { increment, decrease, incrementWithSession } = require('../../connection/autoincrement.js');
require('dotenv').config();

const uri = process.env.DDBB256;
const nombreBase = 'proyectCv';


async function SignIn(userData, req) {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const session = client.startSession();
    await session.startTransaction();

    try {
        const db = client.db(nombreBase);
        userData = await validateCredentialsUser(db, userData, session);
        const encoder = new TextEncoder();
        const jwtconstructor = new SignJWT(Object.assign({}, userData));
        const jwt = await jwtconstructor
        .setProtectedHeader({alg:"HS256", typ: "JWT"})
        .setIssuedAt()
        .setExpirationTime("2h")
        .sign(encoder.encode(process.env.JWT256));
        req.data = jwt;

        let update = await db.collection('Tokens_Api').findOne({ Id_User_Api: userData._id }, {session});

        (!update)
        ?   await db.collection('Tokens_Api').insertOne({ Id_User_Api : userData._id , Token : jwt }, {session})
        :   await db.collection('Tokens_Api').findOneAndUpdate({ Id_User_Api : userData._id },{$set: { Token : jwt }}, {session})
 
        await session.commitTransaction();
        const result = {status: 201, message: jwt, instructions: "In the header of the request put the header 'Authorization' and then put this key as value", User : userData._id, rolsUser : userData.Role };
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
    SignIn
};