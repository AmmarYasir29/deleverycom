const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createMerchant = async (req, res) => {
  const {
    fullname = "",
    username = "",
    phone = "",
    pageName = "",
    lat = "",
    long = "",
    debt = 0,
    city = "",
    password = "1",
  } = req.body;
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
      password,
    },
  });
  res.json(newMerchant);
};

const showMerchants = async (req, res) => {
  const users = await prisma.merchant.findMany();
  res.json(users);
};

module.exports = {
  createMerchant,
  showMerchants,
};
