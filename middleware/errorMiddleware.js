// const AppError = require("../helper/AppError");
const PrismaError = require("../helper/PrismaError");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const errorHandler = async (err, req, res, next) => {
  try {
    await prisma.apiAuditLog.create({
      data: {
        method: req.method,
        urlPath: req.originalUrl,
        headers: req.headers,
        queryParams: req.query,
        requestBody: req.body,
        ipAddress: req.ip,
        responseStatus: res.statusCode || 500,
        errorMessage: err.message,
        errorStack: err.stack,
      },
    });
  } catch (error) {
    console.error("Error saving error log:", error);
  }

  //* custom error *//

  // console.log("before message " + error.errCode);
  // let message;
  // switch (error.errCode) {
  //   case "1":
  //     message = "new tet s";
  //   case "2":
  //     message = "neeeee";
  //   default:
  //     return error.message;
  // }
  // console.log(message);

  if (err instanceof PrismaError) {
    return res.status(err.statusCode).json({
      success: false,
      name: err.name,
      message: err.message,
      errCode: err.errCode,
    });
  }

  //* custom other error *//
  // if (error instanceof AppError) {
  //   return res.status(error.statusCode).json({
  //     success: false,
  //     name: error.name,
  //     message: error.message,
  //   });
  // }
  //* random error *//
  return res.status(500).send(`something got wrong: ${err}`);
};

module.exports = errorHandler;
