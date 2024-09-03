var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();

const login = async (req, res) => {
  const { username, password, loginType, fcmToken = "" } = req.body;
  if (password.length < 3)
    return res.status(400).json({ Message: "Enter correct password" });
  let user;
  let role;
  // Merchant Login
  // try {
  if (loginType == 1) {
    user = await prisma.merchant.findUnique({
      where: {
        username,
      },
    });
    if (!user) return res.status(400).json({ message: "Merchant Not Exist" });
    role = 1;
  } else if (loginType == 2) {
    // Delegate Login
    user = await prisma.delegate.findUnique({
      where: { username },
    });
    if (!user) return res.status(400).json({ message: "Delegate Not Exist" });
    role = 2;
  } else if (loginType == 3) {
    user = await prisma.super.findUnique({
      where: { username },
    });

    if (!user) return res.status(400).json({ message: "Not Exist" });
    if (user.type == 3) role = 3; // admin
    else if (user.type == 4) role = 4; //emp
  }

  const isMatch = await bcrypt.compare(password, user.password);
  !isMatch && res.status(404).json({ message: "Incorrect Password!" });
  const payload = {
    user: {
      id: user.id,
      role,
      fcmToken,
    },
  };

  jwt.sign(payload, process.env.JWT_KEY, (err, token) => {
    if (err) res.status(500).json({ err });
    res.status(200).json({ token, id: user.id, role });
  });
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
