const jwt = require("jsonwebtoken");
// require("dotenv").config();

module.exports = function (req, res, next) {
  const token = req.header("token");
  if (!token) return res.status(401).json({ message: "Access denied'" });

  try {
    // const decoded = jwt.verify(token, process.env.JWT_KEY);
    const decoded = jwt.verify(token, "secretOrPrivateKey");
    req.user = decoded.user;
    next();
  } catch (e) {
    console.error(e);
    res.status(501).send({ message: "Invalid Token" });
  }
};
