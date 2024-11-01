const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
var bcrypt = require("bcryptjs");
const sendNofi = require("../helper/sendNofi");
const PrismaError = require("../helper/PrismaError");
const AppError = require("../helper/AppError");
const errorCode = require("../helper/errorCode");

const createMerchant = async (req, res, next) => {
  const {
    fullname = "",
    username,
    password,
    phone,
    pageName,
    city,
    area = "",
    lat = "0",
    long = "0",
  } = req.body;
  let english = /^[A-Za-z0-9]*$/;
  try {
    if (username.indexOf(" ") >= 0)
      throw new AppError("اسم المستخدم يحتوي على مسافة", 406, 406);

    for (i = 0; i < username.length; i++)
      if (!english.test(username[i]))
        throw new AppError(
          "اسم المستخدم يحتوي احرف اللغة الانكليزية وارقام فقط",
          406,
          406
        );

    const salt = await bcrypt.genSalt(10);
    const cryptPassword = await bcrypt.hash(password, salt);

    const newMerchant = await prisma.merchant.create({
      data: {
        fullname,
        username,
        phone,
        pageName,
        lat,
        long,
        debt: 0,
        city,
        area,
        password: cryptPassword,
      },
    });

    res.status(200).json(newMerchant);
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

const showMerchants = async (req, res, next) => {
  let users;
  let city = req.query.merchantCity ? req.query.merchantCity : "";
  let name = req.query.pageName ? req.query.pageName : "";
  try {
    if (req.user.role == 1 || req.user.role == 2) {
      throw new AppError("ليس لديك صلاحية", 401, 401);
    }

    if (city != "") {
      users = await prisma.merchant.findMany({
        where: {
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
          pageName: true,
          debt: true,
          lat: true,
          long: true,
        },
      });
    } else if (name != "") {
      users = await prisma.merchant.findMany({
        where: {
          pageName: {
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
          pageName: true,
          debt: true,
          lat: true,
          long: true,
        },
      });
    } else if (name != "" && city != "") {
      users = await prisma.merchant.findMany({
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
          pageName: true,
          debt: true,
          lat: true,
          long: true,
        },
      });
    } else {
      users = await prisma.merchant.findMany({
        select: {
          id: true,
          fullname: true,
          username: true,
          phone: true,
          city: true,
          area: true,
          pageName: true,
          debt: true,
          lat: true,
          long: true,
        },
      });
    }
    res.status(200).json(users || []);
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

const showDebt = async (req, res) => {
  const merchantId =
    req.user.role == 1 ? req.user.id : parseInt(req.query.merchantId);

  const totalDebt = await prisma.merchant.findUnique({
    where: {
      id: merchantId,
    },
    select: {
      debt: true,
    },
  });
  const penddingOrder = await prisma.order.count({
    where: { merchantId, orderStatus: 1 },
  });

  const assignedOrder = await prisma.order.count({
    where: { merchantId, orderStatus: 2 },
  });
  const guaranteedOrder = await prisma.order.count({
    where: { merchantId, orderStatus: 3 },
  });
  const deliverOrder = await prisma.order.count({
    where: { merchantId, orderStatus: 4 },
  });
  const rejectedOrder = await prisma.order.count({
    where: { merchantId, orderStatus: 5 },
  });
  res.send({
    ...totalDebt,
    penddingOrder,
    assignedOrder,
    guaranteedOrder,
    deliverOrder,
    rejectedOrder,
  });
};

const requestDebt = async (req, res) => {
  const merchantId =
    req.user.role == 1 ? req.user.id : parseInt(req.query.merchantId);
  const io = req.app.get("socketio");

  const updateMerchant = await prisma.merchant.update({
    where: {
      id: merchantId,
    },
    data: {
      moneyReq: true,
    },
  });
  if (req.user.role == 3)
    io.emit("requestDebt", {
      message: "تم طلب الرصيد",
    });

  res.json({ message: `تم طلب الرصيد ${updateMerchant.debt} بنجاح` });
};

const showReqDebt = async (req, res) => {
  // const merchants = await prisma.merchant.findMany({
  //   where: {
  //     debt: {
  //       gt: 0,
  //     },
  //     moneyReq: true,
  //   },
  //   select: {
  //     id: true,
  //     fullname: true,
  //     username: true,
  //     phone: true,
  //     pageName: true,
  //     lat: true,
  //     long: true,
  //     city: true,
  //     area: true,
  //     moneyReq: true,
  //     debt: true,
  //   },
  // });
  const merchantsWithOrderCount = await prisma.merchant.findMany({
    where: {
      debt: {
        gt: 0,
      },
      moneyReq: true,
    },
    select: {
      id: true,
      fullname: true,
      username: true,
      phone: true,
      pageName: true,
      city: true,
      area: true,
      lat: true,
      long: true,
      moneyReq: true,
      debt: true,
      _count: {
        select: {
          Order: {
            where: {
              orderStatus: 4,
            },
          },
        },
      },
    },
  });
  res.status(200).json(merchantsWithOrderCount);
};

const givenDebt = async (req, res) => {
  const merchantId = parseInt(req.query.merchantId);

  const merchant = await prisma.merchant.findUnique({
    where: {
      id: merchantId,
    },
  });
  const invoice = await prisma.invoice.create({
    data: {
      amount: merchant.debt,
      type: 2,
      merchant: {
        connect: {
          id: merchantId,
        },
      },
    },
  });

  const merchantUpdate = await prisma.merchant.update({
    where: {
      id: merchantId,
    },
    data: {
      moneyReq: false,
      debt: 0,
    },
  });
  if (merchant.fcmToken)
    await sendNofi(
      "تصفير الحساب",
      "تمت معالجة الطلب- تصفير الرصيد",
      merchant.fcmToken
    );

  res.status(200).json({ message: "تم تصفير الرصيد" });
};
const showStatements = async (req, res) => {
  const take = parseInt(req.query.PAGE_SIZE) || 25;
  const pageNumber = parseInt(req.query.pageNumber) || 0;

  const skip = (pageNumber - 1) * take;
  const merchantId =
    req.user.role == 1 ? req.user.id : parseInt(req.query.merchantId);
  const detailsDebt = await prisma.invoice.findMany({
    where: {
      merchantId,
    },
    orderBy: {
      date: "desc",
    },
    take: 20,
  });
  const total = await prisma.order.count();

  return res.json({
    data: detailsDebt,
    metadata: {
      hasNextPage: skip + take < total,
      totalPages: Math.ceil(total / take),
    },
  });
};
const updateMerInfo = async (req, res, next) => {
  try {
    if (req.user.role == 1 || req.user.role == 2)
      throw new AppError("ليس لديك صلاحية", 401, 401);

    if (!req.query.merchantId) throw new AppError("يجب اختيار تاجر", 406, 406);
    let merchantId = parseInt(req.query.merchantId);
    const { fullname, phone, pageName, city, area } = req.body;

    const updatedMer = await prisma.merchant.update({
      where: { id: merchantId },
      data: {
        fullname,
        phone,
        pageName,
        city,
        area,
      },
    });
    return res.json(updatedMer);
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

module.exports = {
  createMerchant,
  showMerchants,
  showDebt,
  showStatements,
  requestDebt,
  showReqDebt,
  givenDebt,
  updateMerInfo,
};
