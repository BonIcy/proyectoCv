const { MongoClient } = require('mongodb');

async function connection() {
  const uri = process.env.DDBB256;
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('Conexión exitosa a la base de datos ' + uri);
    return client.db();
  } catch (error) {
    console.error('Error de conexión a la base de datos:', error);
    throw error;
  }
}

module.exports = connection;
