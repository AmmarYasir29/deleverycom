class PrismaError extends Error {
  constructor(name, message, statusCode, errCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = name;
    this.errCode = errCode;
  }
}
module.exports = PrismaError;
