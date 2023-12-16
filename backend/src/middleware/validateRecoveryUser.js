const { MongoClient } = require("mongodb");
const express = require("express");
require("dotenv").config();


async function validateCredentialsRecoveryUser(db, userData, session) {
  try {

    let validatedUser = {};

    validatedUser = await findOne('User', db, 'Username', userData.Username, session);

    if (validatedUser.Email !== userData.Email) {
        throw new Error(
            `El email no corresponde al usuario, por favor inténtelo de nuevo.`
        );
    }
   
    return validatedUser

  } catch (error) {
    throw error;
  }
}

async function findOne( collectionName, db, parameter, data,  session) {
  
    const result = await db.collection(collectionName).findOne({ [parameter]: data }, {session});
    if (!result) {
        throw new Error(
            `No existe ningun usuario con el ${parameter}: ${data}`
        );
    } else {
        return result;
    }
}
module.exports = {
    validateCredentialsRecoveryUser,
};
