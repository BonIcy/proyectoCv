const { MongoClient } = require("mongodb");
const express = require("express");
require("dotenv").config();


async function validateCredentialsUser(db, userData, session) {
  try {

    let validatedUser = {};
    !userData.Email ? validatedUser = await findOne('User', db, 'Username', userData.Username, session) : validatedUser = await findOne('User', db, 'Email', userData.Email, session);

    if (validatedUser.Password !== userData.Password) {
        throw new Error(
            `Contraseña Incorrecta vuelve a intentarlo`
        );
    }
    delete validatedUser.Password;
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
  validateCredentialsUser,
};
