function handleMongoValidationError(error, res) {
  if (error.name === 'MongoServerError' && error.code === 121) {
    // MongoDB validation error
    const errorInfo = error.errInfo || {};
    const details = errorInfo.details || {};
    const { operatorName, title, schemaRulesNotSatisfied } = details;

    const formattedError = {
      errorType: 'MongoValidation',
      title,
      operatorName,
      validationErrors: schemaRulesNotSatisfied.map(rule => ({
        operatorName: rule.operatorName,
        specifiedAs: rule.specifiedAs,
        missingProperties: rule.missingProperties || [],
        additionalProperties: rule.additionalProperties || [],
        failingDocumentId: errorInfo.failingDocumentId,
      })),
    };

    res.status(400).json(formattedError);
  } else if (error.name === 'MongoServerError' && error.code === 11000) {
    // MongoDB duplicate key error
    const keyPattern = error.keyPattern || {};
    const keyValue = error.keyValue || {};

    const formattedError = {
      errorType: 'MongoDuplicateKey',
      keyPattern,
      keyValue,
    };

    res.status(400).json(formattedError);
  } else {
    // Other MongoDB errors
    const formattedError = {
      errorType: 'MongoError',
      message: error.message || 'Internal Server Error',
    };

    res.status(500).json(formattedError);
  }
}

module.exports = {
  handleMongoValidationError,
};
