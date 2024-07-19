// var bcrypt = require("bcryptjs");
// var jwt = require("jsonwebtoken");
// const User = require("../models/user");
// const uploadImage = require("../helper/General");

const singup = async (req, res) => {
  const { username, fullname, password } = req.body;
  try {
    let userExist = await User.findOne({ email });
    let usernameExist = await User.findOne({ username });
    if (userExist || usernameExist)
      return res.status(400).json({ msg: "User Already Exists" });

    user = new User({
      username,
      fullname,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.point += 1;
    let savedUser = await user.save();

    // const token = jwt.sign(
    //   { userId: savedUser._id },
    //   "secretOrPrivateKey" //, {expiresIn: "1h",}
    // );
    const payload = {
      user: {
        id: savedUser.id,
      },
    };

    jwt.sign(payload, "secretOrPrivateKey", (err, token) => {
      if (err) res.status(500).json({ err });
      res.status(201).json({ token, userId: savedUser.id });
    });
  } catch (err) {
    res.status(501).json({ msg: "Error in Saving", err });
  }
};

const signin = async (req, res) => {
  if (req.body.password.length < 6) {
    return res.status(400).json({ Message: "Enter correct password" });
  }

  const { email, username, password } = req.body;

  try {
    if (email) {
      data = {
        email: email,
      };
    } else if (username) {
      data = {
        username: username,
      };
    } else {
      res.status(400).json({ message: "Enter username or email" });
    }

    const user = await User.findOne(data);

    if (!user) return res.status(400).json({ message: "User Not Exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    !isMatch && res.status(404).json({ message: "Incorrect Password !" });

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, "secretOrPrivateKey", (err, token) => {
      if (err) res.status(500).json({ err });
      res.status(200).json({ token, id: user.id });
    });
  } catch (e) {
    res.status(501).json({
      message: "cerate user Error",
      err: e,
    });
  }
};

const userInfo = async (req, res) => {
  try {
    let user;
    let followMe = false;
    if (req.query.userId) {
      user = await User.findById(req.query.userId);
    } else if (req.query.username) {
      user = await User.findOne({ username: req.query.username });
    } else {
      user = await User.findById(req.user.id);
    }
    if (!user) res.status(404).json({ message: "User not found" });

    const followCount = {};
    followCount.followers = user.followers.length;
    followCount.followings = user.followings.length;
    const { password, updatedAt, followings, followers, ...other } = user._doc;

    if (user.followers.includes(req.user.id)) followMe = true;

    res.status(200).json({ user: other, followCount, followMe });
  } catch (e) {
    res.status(501).json({ message: "Error in Fetching user", err: e });
  }
};

const userFollow = async (req, res) => {
  if (req.user.id !== req.params.id) {
    // console.log(req.user);
    // console.log(req.params);
    // return res.status(200).json("ok");
    try {
      const user = await User.findById(req.params.id);
      const currenUser = await User.findById(req.user.id);
      if (!user.followers.includes(req.user.id)) {
        await user.updateOne({ $push: { followers: req.user.id } });
        await currenUser.updateOne({ $push: { followings: req.params.id } });
        return res.status(200).json({ message: "User has been followed" });
      } else {
        return res
          .status(403)
          .json({ message: "You allready follow this user" });
      }
    } catch (error) {
      res.status(501).json(error);
    }
  } else {
    res.status(403).json({ message: "You cant follow yourself" });
  }
};

const userUnfollow = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currenUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currenUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json({ message: "you dont follow this user" });
      }
    } catch (error) {
      res.status(501).json(error);
    }
  } else {
    res.status(403).json({ message: "You cant unfollow yourself" });
  }
};

const userUpdate = async (req, res) => {
  if (req.user.id === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        res.status(501).json(error);
      }
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (error) {
      return res.status(501).json({ message: "error in updated user", error });
    }
  } else {
    return res
      .status(400)
      .json({ message: "You can update only your account" });
  }
};

const profilePicUpdate = async (req, res) => {
  if (!req.file)
    return res.status(400).json({ Message: "please provide image file" });
  const metaFile = {
    type: req.file.mimetype,
    buffer: req.file.buffer,
  };
  let PicUrl = await uploadImage(metaFile, "single");
  const doc = await User.findById(req.user.id);
  doc.profilePicture = PicUrl;
  await doc.save();

  res.status(200).json({ Message: "The Pic updated successfully" });
};

const ListOfFollowers = async (req, res) => {
  const user = await User.findById(req.params.id);
  const followerIds = user.followers;
  const followrsInfo = await User.find({ _id: { $in: followerIds } });
  let followrsInfoRes = {};
  for (let index = 0; index < followrsInfo.length; index++) {
    const element = followrsInfo[index];
    followrsInfoRes = followrsInfo.map(function (item) {
      return {
        id: item._id,
        fullname: item.fullname,
        username: item.username,
        profilePicture: item.profilePicture,
      };
    });
  }
  res.status(200).json({ followrsInfoRes });
};
/**
 * Summary. ⚡️ Will send you all the followings
 * @param {number} id accept number and it's should have the userId
 */
const ListOfFollowings = async (req, res) => {
  const user = await User.findById(req.params.id);
  const followingIds = user.followings;
  const followingInfo = await User.find({ _id: { $in: followingIds } });
  let followingInfoRes = {};
  for (let index = 0; index < followingInfo.length; index++) {
    const element = followingInfo[index];
    followingInfoRes = followingInfo.map(function (item) {
      return {
        id: item._id,
        fullname: item.fullname,
        username: item.username,
        profilePicture: item.profilePicture,
      };
    });
  }
  res.status(200).json({ followingInfoRes });
};

module.exports = {
  signin,
  singup,
  userInfo,
  userUpdate,
  userFollow,
  userUnfollow,
  profilePicUpdate,
  ListOfFollowers,
  ListOfFollowings,
};
