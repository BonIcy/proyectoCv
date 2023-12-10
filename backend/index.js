const express = require('express');
const app = express();
const cors = require('cors');
const connection = require('./src/connection/db.js'); 

require('dotenv').config();
app.use(express.json());

// cors config uwu
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// inicializacion del server
async function startServer() {
  try {
    const db = await connection();
    const routerBase = require('./src/routes/routes.js');
    app.use('/cvs', routerBase);
    const port = process.env.PORT256;
    app.listen(port, () => {
      console.log(`Servidor corriendo en el puerto ${port}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
  }
}

startServer();
