const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
  // const token = req.header("Token");
  // if (!token) return res.status(401).json({ message: "Access denied'" });
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    // const decoded = jwt.verify(token, "secretOrPrivateKey");
    req.user = decoded.user;
    next();
  } catch (e) {
    res.status(501).send({ message: "Invalid Token" });
  }
};

module.exports.authenticateSocket = function (socket, next) {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication error"));
    // return res.status(401).json({ message: "Authentication error" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    // const decoded = jwt.verify(token, "secretOrPrivateKey");
    socket.user = decoded.user;
    next();
  } catch (e) {
    return next(new Error("Invalid Token", e));
  }
};
