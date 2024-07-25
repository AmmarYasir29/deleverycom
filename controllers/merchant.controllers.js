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
  let city = req.query.delegateCity ? req.query.delegateCity : "";
  let name = req.query.delegateName ? req.query.delegateName : "";
  if (city != "") {
    users = await prisma.delegate.findMany({
      where: {
        city,
      },
    });
  } else if (name != "") {
    users = await prisma.merchant.findMany({
      where: {
        fullname: name,
      },
    });
  } else if (name != "" && city != "") {
    users = await prisma.merchant.findMany({
      where: {
        fullname: name,
        city,
      },
    });
  } else {
    users = await prisma.merchant.findMany();
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
};
