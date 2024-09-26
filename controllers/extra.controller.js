const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const sendNofi = require("../helper/sendNofi");
const requestIp = require("request-ip");
const PrismaError = require("../helper/PrismaError");
const AppError = require("../helper/AppError");
const errorCode = require("../helper/errorCode");
var bcrypt = require("bcryptjs");

const sendNotificaton = async (req, res, next) => {
  let dataObj = {
    orderId: "2222222",
    orderDate: "2020-02-02",
  };
  try {
    let x = await sendNofi(
      "title",
      "body",
      "cTP863XiRY2zbZcBHe65Hj:APA91bFN5fZmnYSWUM0rY1m6UtT1WrWVJv3adSAKwDwx4N6CytrbI0yD_purM8c_C8JTf6rcbiFH-yUYQ7GxPFEf-AfIKHuBXaWFHbPU_vWNgCAY7kVqcjoIdUSls58E8ua3_PM0IVmW"
    );
    console.log(x);

    res.json({ resutlt: x });
  } catch (error) {
    res.status(500).send("Unexpected error: " + error);
  }
};
const addEmp = async (req, res, next) => {
  const { username, password, fullname } = req.body;
  let english = /^[A-Za-z0-9]*$/;
  try {
    if (req.user.role != 3)
      throw new AppError("انشاء حساب من صلاحية الادمن", 401, 401);
    if (username.indexOf(" ") >= 0)
      throw new AppError("اسم المستخدم يحتوي على مسافة", 406, 406);

    for (i = 0; i < username.length; i++)
      if (!english.test(username[i]))
        throw new AppError("اسم المستخدم باللغة الانكليزية فقط", 406, 406);

    const salt = await bcrypt.genSalt(10);
    const cryptPassword = await bcrypt.hash(password, salt);

    const newEmp = await prisma.Super.create({
      data: {
        username,
        password: cryptPassword,
        fullname,
        type: 4,
      },
    });
    res.status(201).json("تم انشاء حساب الموظف بنجاح");
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

const auditSys = async (req, res) => {
  let auditRec = await prisma.ApiAuditLog.findMany();
  return res.json(auditRec);
};
const getIp = async (req, res) => {
  res.json({
    socket: req.socket.remoteAddress,
    ipAddress: req.ipAddress,
    clintIP: requestIp.getClientIp(req),
    headerForwared: req.headers["x-forwarded-for"],
  });
};

module.exports = {
  auditSys,
  sendNotificaton,
  getIp,
  addEmp,
};
