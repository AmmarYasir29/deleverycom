const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
var bcrypt = require("bcryptjs");
const PrismaError = require("../helper/PrismaError");
const AppError = require("../helper/AppError");
const errorCode = require("../helper/errorCode");

const createdelegate = async (req, res, next) => {
  const { username, password, fullname, phone, city, area } = req.body;
  try {
    // const usernaemExist = await prisma.delegate.count({
    //   where: { username },
    // });
    if (username.indexOf(" ") >= 0) {
      // return res.status(400).json("username have space");
      throw new AppError("username have space", 404, 400);
    }
    // if (usernaemExist > 0)
    // throw new AppError("APIError", "username exist try others", 1);
    const salt = await bcrypt.genSalt(10);
    const cryptPassword = await bcrypt.hash(password, salt);

    const newDelegate = await prisma.delegate.create({
      data: {
        username,
        password: cryptPassword,
        phone,
        fullname,
        city,
        area,
      },
    });
    res.json(newDelegate);
  } catch (e) {
    if (e instanceof AppError) {
      next(new AppError("Validation Error", e.name, e.code, e.errorCode));
    } else if (
      e instanceof Prisma.PrismaClientKnownRequestError ||
      e instanceof Prisma.PrismaClientUnknownRequestError ||
      e instanceof Prisma.PrismaClientRustPanicError ||
      e instanceof Prisma.PrismaClientInitializationError ||
      e instanceof Prisma.PrismaClientValidationError
    ) {
      let msg = errorCode(`${e.code || e.errorCode}`, "DB error not found");
      next(
        new PrismaError(e.name, msg, 400, (errCode = e.code || e.errorCode))
      );
    }
  }
};

const showdelegate = async (req, res) => {
  let users;
  let city = req.query.delegateCity ? req.query.delegateCity : "";
  let name = req.query.delegateName ? req.query.delegateName : "";
  if (city != "") {
    users = await prisma.delegate.findMany({
      where: {
        city: {
          contains: city,
        },
      },
      select: {
        id: true,
        fullname: true,
        username: true,
        phone: true,
        city: true,
        area: true,
      },
    });
  } else if (name != "") {
    users = await prisma.delegate.findMany({
      where: {
        fullname: {
          contains: name,
        },
      },
      select: {
        id: true,
        fullname: true,
        username: true,
        phone: true,
        city: true,
        area: true,
      },
    });
  } else if (name != "" && city != "") {
    users = await prisma.delegate.findMany({
      where: {
        fullname: {
          contains: name,
        },
        city: {
          contains: city,
          // search: city,
        },
      },
      select: {
        id: true,
        fullname: true,
        username: true,
        phone: true,
        city: true,
        area: true,
      },
    });
  } else {
    users = await prisma.delegate.findMany({
      select: {
        id: true,
        fullname: true,
        username: true,
        phone: true,
        city: true,
        area: true,
      },
    });
  }
  res.json(users);
};

const delegateOrders = async (req, res) => {
  let delegateId = parseInt(req.query.delegateId);
  let orders = await prisma.order.findMany({
    where: {
      delegateId: delegateId,
    },
  });
  res.json(orders);
};

module.exports = {
  delegateOrders,
  createdelegate,
  showdelegate,
};
