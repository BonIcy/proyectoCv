//Mongo error handling function

function errorcontroller(error, res) {
    switch (error.code) {
        case 121:
            const ErrorL = error.errInfo.details.schemaRulesNotSatisfied;
            res.status(500).send({status: 500, message: ErrorText(ErrorL)});
        break;
        
        case 11000:
            res.status(500).send({status: 500, message: duplicateError(error)});        
        break;
        default:
            res.status(500).send({ status: 500, message: "Error executing the request" });
        break;
    }
}



//MONGO error messages printing function
function ErrorText(error) {
    let text = "Errors found: "
    error.forEach(errores => {
         let TpoError = errores.operatorName;
        switch (TpoError) {
            case "properties":
                text += ` Incorrect validation error: `
                let DesError = errores.propertiesNotSatisfied
                DesError.forEach(Errores => {

                    text += `/${Errores.description}/ `
                });
                break;

            case "additionalProperties":
                let NoError = errores.additionalProperties
                text += ` Incorrect data error: The program does not accept the data cataloged as: `
                NoError.forEach(dataIn => {

                    text += `/${dataIn}/ `
                });
                console.log(errores);
                break;
        
            default:
                break;
        }
    });
    return text;
}

function duplicateError(error) {
    let duplicateText = `Duplicate data error: `
    let duplicateError = error.keyValue;
    let nameError = Object.keys(duplicateError)[0];
    duplicateText += `the value "${duplicateError[nameError]}" of the parameter "${nameError}" is already in the database `
    return duplicateText
}

module.exports = errorcontroller;