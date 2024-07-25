const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
var bcrypt = require("bcryptjs");

const createdelegate = async (req, res) => {
  const {
    username,
    password,
    fullname = "",
    phone = "",
    city = "",
    area = "",
  } = req.body;

  const usernaemExist = await prisma.delegate.count({
    where: { username },
  });
  if (usernaemExist > 0) return res.json(`username exist try others`);
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
};

const showdelegate = async (req, res) => {
  let users;
  let city = req.query.delegateCity ? req.query.delegateCity : "";
  let name = req.query.delegateName ? req.query.delegateName : "";
  // if (city != "") {
  //   users = await prisma.delegate.findMany({
  //     where: {
  //       city,
  //     },
  //   });
  // } else
  if (name != "") {
    users = await prisma.delegate.findMany({
      where: {
        fullname: name,
      },
    });
  } else {
    users = await prisma.delegate.findMany();
  }
  res.json(users);
};

module.exports = {
  createdelegate,
  showdelegate,
};
