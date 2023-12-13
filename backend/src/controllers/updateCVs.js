const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.DDBB256;
const nombreBase = 'proyectCv';

async function updateCVs( camperId, CV) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(nombreBase);
    const collection = db.collection('CVs');
    const NcamperId = parseInt(camperId);
    let data = {CamperId: NcamperId, Name: CV.name, Pdf: CV.data, ContentType: "application/pdf"};
    console.log(data);

    const result = await collection.updateOne({ CamperId: NcamperId }, { $set: data });
    if (result.matchedCount === 0) {
      throw new Error(`Camper con ID ${camperId} no encontrado`);
    }

    return result;
  } catch (error) {
    console.error(error.message);
    throw error;
  } finally {
    client.close();
  }
}

module.exports = {
    updateCVs
};
