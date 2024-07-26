const AppError = require("../helper/AppError");

const errorHandler = (error, req, res, next) => {
  //* custom error *//
  if (error.name === "ValidationError") {
    return req.status(400).send({
      success: false,
      type: "VaildationError",
      details: error.details,
    });
  }

  //* custom other error *//
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      errorCode: error.errorCode,
    });
  }

  //* random error *//
  return res.status(500).send(`something got wrong ${error.message}`);
};

module.exports = errorHandler;
