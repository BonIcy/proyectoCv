const { MongoClient } = require("mongodb");
const express = require("express");
require("dotenv").config();


async function validateCredentialsNewPassword(db, userData, session) {
  try {

    let validatedUser = {};

    validatedUser = await findOne('PasswordCode', db, 'Username', userData.Username, session);

    if (validatedUser.Email !== userData.Email) {
        throw new Error(
            `El email no corresponde al usuario, por favor inténtelo de nuevo.`
        );
    }
    
    if (validatedUser.Recovery_Code !== userData.Recovery_Code) {
        throw new Error(
            `Código de recuperación de contraseña incorrecto, solicite otro código e inténtelo de nuevo.`
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
            `El usuario ${data}, no ha solicitado un cambio de contraseña`
        );
    } else {
        return result;
    }
}
module.exports = {
    validateCredentialsNewPassword,
};
