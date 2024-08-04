class AppError extends Error {
  constructor(name, message, errorCode, statusCode) {
    super(message);
    this.name = name;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
  }
}
module.exports = AppError;
