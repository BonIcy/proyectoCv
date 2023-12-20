const { MongoClient } = require("mongodb");
const express = require("express");
require("dotenv").config();


async function validateCredentialsNewCamper(db, userData, session) {
  try {

    let validatedUser = {};

    validatedUser = await findOne('User', db, 'Username', userData.Username, session);

    validatedUser = await findOne('User', db, 'Email', userData.Email, session);

    return validatedUser

  } catch (error) {
    throw error;
  }
}

async function findOne( collectionName, db, parameter, data,  session) {
  
    const result = await db.collection(collectionName).findOne({ [parameter]: data }, {session});
    if (result) {
        throw new Error(
            `Error: Ya existe un usuario con el ${parameter}: ${data}`
        );
    } else {
        return result;
    }
}
module.exports = {
    validateCredentialsNewCamper,
};
