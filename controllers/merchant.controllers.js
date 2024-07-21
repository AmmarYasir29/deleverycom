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
  } = req.body;
  // usernaemExist = prisma.merchant.findUnique({ where: { username } });
  // if (usernaemExist) return res.json(`username exist try others${usernaemExist}`);
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
      password: cryptPassword,
    },
  });
  res.json(newMerchant);
};

const showMerchants = async (req, res) => {
  const users = await prisma.merchant.findMany();
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
  const detailsDebt = await prisma.invoice.findMany({
    where: { merchantId: merchantId },
  });
  res.send({ ...totalDebt, ...detailsDebt });
};

module.exports = {
  createMerchant,
  showMerchants,
  showDebt,
};
