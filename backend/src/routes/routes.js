
const express = require('express');
require('dotenv').config();
const router = express.Router();
const { MongoClient } = require('mongodb');
const errorcontroller  = require('../middleware/errorsMongodb.js');
const getData = require('../controllers/get');
const getInfoCampers = require('../controllers/InfoCampers.js');
const getUserInfo = require('../controllers/InfoUser.js');

const {postData} = require('../controllers/post');
const {deleteData} = require('../controllers/delete');
const {updateData} = require('../controllers/update');
const { hiringCamper } = require('../controllers/hiring');
const uri = process.env.DDBB256;
const nombreBase = 'proyectCv';

router.get('/test', async (req, res) => {
    try {
        console.log('testeando');
    } catch (error) {
        console.log(error.message);
    }
})
//!get
router.get('/:collectionName', async (req, res) => {
    const {collectionName} = req.params
    try {
      const result = await getData(collectionName, {});
      res.json(result);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: `Error al obtener ${collectionName}`  });
    }
  });
  
//!post
router.post('/add/:collectionName', async (req, res) => {
    const { collectionName } = req.params;
    const data = req.body;
  
    try {
      const result = await postData(collectionName, data);
      res.status(201).json({result,data});
    } catch (error) {
      console.error(error.message);
      errorcontroller(error, res);
    }
  });
  

//!delete
router.delete('/del/:collectionName/:itemId', async (req, res) => {
    const { collectionName, itemId } = req.params;
    try {
      const result = await deleteData(collectionName, itemId);
      res.json(result);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: `Error al deletear el elemento de ${collectionName}` });
    }
});

//!update
router.put('/upd/:collectionName/:itemId', async (req, res) => {
    const { collectionName, itemId } = req.params;
    const newData = req.body;
  
    try {
      const result = await updateData(collectionName, itemId, newData);
      res.json(result);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: `Error al actualizar el elemento de ${collectionName}` });
    }
  });

  
//hiring

router.put('/hiring/:collectionName/:itemId', async (req, res) => {
    const { collectionName, itemId } = req.params;

    try {
        const result = await hiringCamper(collectionName, itemId);
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: `Error al actualizar el elemento de ${collectionName}` });
    }
});

//InfoCamper

router.get('/Info/Campers', async (req, res) => {
  try {
    const result = await getInfoCampers();
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: `Error al obtener la data`, message: error  });
  }
});

// info user

router.get('/Info/Users', async (req, res) => {
    try {
        const result = await getUserInfo();
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: `error al obtener los datos `, message: error });
    }
});

module.exports = router;