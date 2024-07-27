const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
var bcrypt = require("bcryptjs");

const createMerchant = async (req, res) => {
  const {
    fullname = "",
    username,
    phone = "",
    pageName = "",
    lat = "",
    long = "",
    debt = 0,
    city = "",
    password,
    area = "",
  } = req.body;
  const usernaemExist = await prisma.merchant.count({
    where: { username },
  });
  if (usernaemExist > 0) return res.json(`username exist try another`);
  const salt = await bcrypt.genSalt(10);
  const cryptPassword = await bcrypt.hash(password, salt);

  const newMerchant = await prisma.Merchant.create({
    data: {
      fullname,
      username,
      phone,
      pageName,
      lat,
      long,
      debt,
      city,
      area,
      password: cryptPassword,
    },
  });
  res.json(newMerchant);
};

const showMerchants = async (req, res) => {
  let users;
  let city = req.query.merchantCity ? req.query.merchantCity : "";
  let name = req.query.merchantName ? req.query.merchantName : "";
  if (city != "") {
    users = await prisma.merchant.findMany({
      where: {
        city: {
          contains: city,
          // search: city,
        },
      },
      select: {
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
        fullname: {
          contains: name,
        },
      },
      select: {
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
  res.json(users);
};

const showDebt = async (req, res) => {
  const merchantId = parseInt(req.query.merchantId);
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
  const merchantId = parseInt(req.query.merchantId);
  const updateMerchant = await prisma.merchant.update({
    where: {
      id: merchantId,
    },
    data: {
      moneyReq: true,
    },
  });

  res.json({ message: "requested succsufully" });
};

const showAllDebt = async (req, res) => {
  const merchants = await prisma.merchant.findMany({
    where: {
      debt: {
        gte: 0,
      },
    },
    select: {
      fullname: true,
      username: true,
      phone: true,
      pageName: true,
      lat: true,
      long: true,
      city: true,
      area: true,
      moneyReq: true,
      debt: true,
    },
  });
  res.json(merchants);
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

  res.json({ message: "Reset the debt succsufully" });
};
const showStatements = async (req, res) => {
  const merchantId = parseInt(req.query.merchantId);

  const detailsDebt = await prisma.invoice.findMany({
    where: { merchantId },
  });

  res.json(detailsDebt);
};

module.exports = {
  createMerchant,
  showMerchants,
  showDebt,
  showStatements,
  requestDebt,
  showAllDebt,
  givenDebt,
};
