var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();
const PrismaError = require("../helper/PrismaError");
const AppError = require("../helper/AppError");
const errorCode = require("../helper/errorCode");

const login = async (req, res, next) => {
  const { username, password, loginType, fcmToken = "" } = req.body;
  try {
    if (password.length < 3)
      throw new AppError("الرجاء اختيار كلمة مرور صحيحه", 404, 400);
    let user;
    let role;
    if (loginType == 1) {
      // Merchant Login
      user = await prisma.merchant.findUnique({
        where: {
          username,
        },
      });
      if (!user) throw new AppError("حساب التاجر غير موجود", 404, 400);
      role = 1;
    } else if (loginType == 2) {
      // Delegate Login
      user = await prisma.delegate.findUnique({
        where: { username },
      });
      if (!user) throw new AppError("حساب المندوب غير موجود", 404, 400);
      role = 2;
    } else if (loginType == 3) {
      user = await prisma.super.findUnique({
        where: { username },
      });
      if (!user) throw new AppError("حساب الموظف غير موجود", 404, 400);
      if (user.type == 3) role = 3; // admin
      else if (user.type == 4) role = 4; //emp
    }

    const isMatch = await bcrypt.compare(password, user.password);
    !isMatch &&
      (() => {
        throw new AppError("كلمة المرور غير صحيحه", 404, 400);
      })();
    if (loginType == 1) {
      const merchant = await prisma.merchant.update({
        where: { id: user.id },
        data: {
          fcmToken,
        },
      });
    } else if (loginType == 2) {
      const delegate = await prisma.delegate.update({
        where: { id: user.id },
        data: {
          fcmToken,
        },
      });
    }
    const payload = {
      user: {
        id: user.id,
        role,
      },
    };

    jwt.sign(payload, process.env.JWT_KEY, (err, token) => {
      if (err) res.status(500).json({ err });
      res.status(200).json({ token, id: user.id, role });
    });
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

  // } catch (e) {
  // res.json({ msg: e });
  //   res.status(501).json({
  //     message: "cerate user Error",
  //     err: e,
  //   });
  // }
};

module.exports = {
  login,
};
