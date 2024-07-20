const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
var bcrypt = require("bcryptjs");

const createdelegate = async (req, res) => {
  const { username, password, fullname = "", phone = "" } = req.body;

  // usernaemExist = prisma.delegate.findUnique({ where: { username } });
  // if (usernaemExist) return res.json("username exist try others");
  const salt = await bcrypt.genSalt(10);
  const cryptPassword = await bcrypt.hash(password, salt);
  const newDelegate = await prisma.delegate.create({
    data: {
      username,
      password: cryptPassword,
      phone,
      fullname,
    },
  });
  res.json(newDelegate);
};

const showdelegate = async (req, res) => {
  const users = await prisma.delegate.findMany();
  res.json(users);
};

module.exports = {
  createdelegate,
  showdelegate,
};
