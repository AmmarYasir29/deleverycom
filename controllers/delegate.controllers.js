const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
var bcrypt = require("bcryptjs");
const PrismaError = require("../helper/PrismaError");
const AppError = require("../helper/AppError");
const errorCode = require("../helper/errorCode");

const createdelegate = async (req, res, next) => {
  const { username, password, fullname, phone, city, area } = req.body;
  let english = /^[A-Za-z0-9]*$/;

  try {
    if (username.indexOf(" ") >= 0)
      throw new AppError("اسم المستخدم يحتوي على مسافة", 406, 406);

    for (i = 0; i < username.length; i++)
      if (!english.test(username[i]))
        throw new AppError("اسم المستخدم باللغة الانكليزية فقط", 406, 406);

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
      e instanceof Prisma.PrismaClientInitializationError
    ) {
      let msg = errorCode(`${e.code || e.errorCode}`);
      next(
        new PrismaError(e.name, msg, 400, (errCode = e.code || e.errorCode))
      );
    } else if (
      e instanceof Prisma.PrismaClientUnknownRequestError ||
      e instanceof Prisma.PrismaClientRustPanicError ||
      e instanceof Prisma.PrismaClientValidationError
    ) {
      let msg = e.message.split("Argument");
      next(new PrismaError(e.name, msg[1], 406, 406));
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

const resetpassword = async (req, res) => {
  try {
  const { password } = req.body;
let delegateId = parseInt(req.user.id);
  if (req.user.role != 4)
    throw new AppError("ليس لديك صلاحية", 401, 401);

  const salt = await bcrypt.genSalt(10);
  const cryptPassword = await bcrypt.hash(password, salt);
  const delePass = await prisma.delegate.update({
    where: { id: delegateId },
    data: {
      password: cryptPassword,
    },
  });
res.json("تم تحديث الرقم السري بنجاح");
} catch (e) {
  if (e instanceof AppError) {
    next(new AppError("Validation Error", e.name, e.code, e.errorCode));
  } else if (
    e instanceof Prisma.PrismaClientKnownRequestError ||
    e instanceof Prisma.PrismaClientInitializationError
  ) {
    let msg = errorCode(`${e.code || e.errorCode}`);
    next(
      new PrismaError(e.name, msg, 400, (errCode = e.code || e.errorCode))
    );
  } else if (
    e instanceof Prisma.PrismaClientUnknownRequestError ||
    e instanceof Prisma.PrismaClientRustPanicError ||
    e instanceof Prisma.PrismaClientValidationError
  ) {
    let msg = e.message.split("Argument");
    next(new PrismaError(e.name, msg[1], 406, 406));
  }
}


}

module.exports = {
  delegateOrders,
  createdelegate,
  showdelegate,
};
