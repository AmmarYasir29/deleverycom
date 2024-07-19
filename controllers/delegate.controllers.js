const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createdelegate = async (req, res) => {
  const { username = "", password = "1", fullname = "", phone = "" } = req.body;
  const newDelegate = await prisma.delegate.create({
    data: {
      username,
      password,
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
