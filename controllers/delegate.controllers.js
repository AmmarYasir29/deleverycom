const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createdelegate = async (req, res) => {
  const { fullname = "", username = "", password = "1", phone = "" } = req.body;
  const newDelegate = await prisma.delegate.create({
    data: {
      fullname,
      username,
      password,
      phone,
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
