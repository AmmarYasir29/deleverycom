// const AppError = require("../helper/AppError");
const PrismaError = require("../helper/PrismaError");

const errorHandler = (error, req, res, next) => {
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

  if (error instanceof PrismaError) {
    return res.status(error.statusCode).json({
      success: false,
      name: error.name,
      message: error.message,
      errCode: error.errCode,
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
  return res.status(500).send(`something got wrong: ${error}`);
};

module.exports = errorHandler;
