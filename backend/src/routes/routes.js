
const express = require('express');
const fileUpload = require('express-fileupload');
require('dotenv').config();
const router = express.Router();
const { MongoClient } = require('mongodb');
const errorcontroller  = require('../middleware/errorsMongodb.js');
const {handleMongoValidationError}  = require('../middleware/validateMongoErrors.js');
const getData = require('../controllers/get');
const getInfoCampers = require('../controllers/InfoCampers.js');
const getUserInfo = require('../controllers/InfoUser.js');
const getWorkersOrNot = require('../controllers/workers.js');
const {postData} = require('../controllers/post');
const {deleteData} = require('../controllers/delete');
const {updateData} = require('../controllers/update');
const { hiringCamper } = require('../controllers/hiring');
const { UniversalSearchEngine } = require('../controllers/universalSearchEngine.js');
const { updateCVs } = require('../controllers/updateCVs.js');
const { postCamper } = require('../controllers/postCamper.js');
const { putCamper } = require('../controllers/updateCamper.js');
const { deleteCamper } = require('../controllers/deleteCamper.js');
//loginSystem
const { SignUp } = require('../controllers/logIn/signUp.js');
const { SignIn } = require('../controllers/logIn/SignIn.js');
const uri = process.env.DDBB256;
const nombreBase = 'proyectCv';

router.use(fileUpload());
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


//workers

router.get('/Campers/WorkOrNot/:state', async (req, res) => {
  const {state} = req.params;
  const booleano = state.toLowerCase() === "true";
  try {
      const result = await getWorkersOrNot(booleano);
      res.json(result);
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: `Error al consultar el elemento Camper` });
  }
});

//UniversalSearchEngine

router.post('/Campers/SearchEngine', async (req, res) => {
  const filter = req.body;
  console.log(filter);
  try {
      const result = await UniversalSearchEngine(filter);
      res.json(result);
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: `Error al consultar el elemento Camper` });
  }
});

//updateCV
router.put('/updateCVs/:camperId', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send({status: 400, message: `Archive dont found`});
  }
  const { camperId } = req.params;
  const CV = req.files.pdf;
  try {
    const result = await updateCVs(camperId, CV);
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: `Error al actualizar la CV del camper identificado con el id ${camperId}` });
  }
});

//PostCampers
router.post('/newCamper/add', async (req, res) => {

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send({status: 400, message: `Archive dont found`});
  }

  const CV = req.files.pdf;
  const data = req.body;
  const camperData = { ...data };
  delete camperData.Github;
  delete camperData.LinkedIn;
  delete camperData.PresentationVideo;
  const socialData = {
    Github: data.Github,
    LinkedIn: data.LinkedIn,
    DriveVideo: data.PresentationVideo || (data.PresentationVideo === '' ? 'https://www.youtube.com/watch?v=8l31wVP6C2M&t=85s' : data.PresentationVideo)
  }

  try {
    const result = await postCamper(camperData, CV, socialData);
    res.status(201).json(result);
  } catch (error) {
    handleMongoValidationError(error, res);
  }
});

//deleteCamper
router.delete('/newCamper/del/:itemId', async (req, res) => {
  const { itemId } = req.params;
  try {
    const result = await deleteCamper(itemId);
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: `Error al deletear el camper`, message: error.message });
  }
});

//PutCampers
router.put('/newCamper/upd/:itemId', async (req, res) => {

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send({status: 400, message: `Archive dont found`});
  }

  const { itemId } = req.params;
  const CV = req.files.pdf;
  const data = req.body;
  const camperData = { ...data };
  delete camperData.Github;
  delete camperData.LinkedIn;
  delete camperData.PresentationVideo;
  const socialData = {
    Github: data.Github,
    LinkedIn: data.LinkedIn,
    DriveVideo: data.PresentationVideo || (data.PresentationVideo === '' ? 'https://www.youtube.com/watch?v=8l31wVP6C2M&t=85s' : data.PresentationVideo)
  }

  try {
    const result = await putCamper(camperData, CV, socialData, itemId);
    res.status(201).json(result);
  } catch (error) {
    handleMongoValidationError(error, res);
  }
});

//SignUp
router.post('/SignUp/Create', async (req, res) => {
  try {
    let data = req.body;
    data = { ...data, CreatedAt: new Date() };
    let userData = (({ Username, Email, Role, Password, CreatedAt }) => ({ Username, Email, Role, Password, CreatedAt }))(data);
    let companyData = (({ Company, Address, Phone, Country, City, Description, legalRep_Name, legalRep_identificationNumber, CreatedAt }) => ({
      Company,
      Address,
      Phone,
      Country,
      City,
      Description,
      legalRep_Name,
      legalRep_identificationNumber,
    }))(data);
    const result = await SignUp(userData, companyData);
      res.json(result);
  } catch (error) {
      handleMongoValidationError(error, res);
  }
});

//SignUp
router.post('/SignIn/Register', async (req, res) => {
  try {

    let data = req.body;
    const result = await SignIn(data, req);
      res.json(result);
  } catch (error) {
      handleMongoValidationError(error, res);
  }
});

module.exports = router;