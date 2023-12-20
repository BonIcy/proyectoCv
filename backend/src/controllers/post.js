const { MongoClient } = require('mongodb');
const { increment, decrease } = require('../connection/autoincrement.js');
require('dotenv').config();

const uri = process.env.DDBB256;
const nombreBase = 'proyectCv';

async function postData(collectionName, data) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(nombreBase);
    const collection = db.collection(collectionName);
    const id =  await increment(collectionName);
    const document = {_id: id, ...data};
    const result = await collection.insertOne(document);
    return result
  } catch (error) {
    await decrease(collectionName);
    console.error(error.message);
    throw error;
  } finally {
    client.close();
  }
}

module.exports = {
  postData
};