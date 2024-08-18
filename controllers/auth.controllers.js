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
  !isMatch && res.status(404).json({ message: "Incorrect Password !" });
  const payload = {
    user: {
      id: user.id,
      role,
      fcmToken,
    },
  };

  // jwt.sign(payload, "secretOrPrivateKey", (err, token) => {
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

// const userInfo = async (req, res) => {
//   try {
//     let user;
//     let followMe = false;
//     if (req.query.userId) {
//       user = await User.findById(req.query.userId);
//     } else if (req.query.username) {
//       user = await User.findOne({ username: req.query.username });
//     } else {
//       user = await User.findById(req.user.id);
//     }
//     if (!user) res.status(404).json({ message: "User not found" });

//     const followCount = {};
//     followCount.followers = user.followers.length;
//     followCount.followings = user.followings.length;
//     const { password, updatedAt, followings, followers, ...other } = user._doc;

//     if (user.followers.includes(req.user.id)) followMe = true;

//     res.status(200).json({ user: other, followCount, followMe });
//   } catch (e) {
//     res.status(501).json({ message: "Error in Fetching user", err: e });
//   }
// };

// const userUpdate = async (req, res) => {
//   if (req.user.id === req.params.id || req.body.isAdmin) {
//     if (req.body.password) {
//       try {
//         const salt = await bcrypt.genSalt(10);
//         req.body.password = await bcrypt.hash(req.body.password, salt);
//       } catch (error) {
//         res.status(501).json(error);
//       }
//     }
//     try {
//       const updatedUser = await User.findByIdAndUpdate(req.params.id, {
//         $set: req.body,
//       });
//       res.status(200).json("Account has been updated");
//     } catch (error) {
//       return res.status(501).json({ message: "error in updated user", error });
//     }
//   } else {
//     return res
//       .status(400)
//       .json({ message: "You can update only your account" });
//   }
// };

module.exports = {
  login,
  // userInfo,
  // userUpdate,
};
