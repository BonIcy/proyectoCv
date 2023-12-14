const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.DDBB256;
const nombreBase = 'proyectCv'

async function  increment(coleccion){
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db(nombreBase);
        const autoincrement = db.collection('autoincrement');
        const sequenceDocument = await autoincrement.findOneAndUpdate(
            { _id: `${coleccion}Id` },
            { $inc: { sequence_value: 1 } },
            { returnDocument: "after" }
        );
        return sequenceDocument.sequence_value;
    } catch (error) {
        console.error(error.message);
        throw error;
    } finally {
        client.close();
    }
}

async function  decrease(coleccion){
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db(nombreBase);
        const autoincrement = db.collection('autoincrement');
        const sequenceDocument = await autoincrement.findOneAndUpdate(
            { _id: `${coleccion}Id` },
            { $inc: { sequence_value: -1 } },
            { returnDocument: "after" }
        );
        return sequenceDocument.sequence_value;
    } catch (error) {
        console.error(error.message);
        throw error;
    } finally {
        client.close();
    }
}

async function  incrementWithSession(coleccion, session, db){
  
    try {
        const autoincrement = db.collection('autoincrement');
        const sequenceDocument = await autoincrement.findOneAndUpdate(
            { _id: `${coleccion}Id` },
            { $inc: { sequence_value: 1 } },
            { returnDocument: 'after', session }
        );
        return sequenceDocument.sequence_value;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}
  
module.exports = {increment, decrease, incrementWithSession};