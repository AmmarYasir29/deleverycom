const express = require("express");
const authRouter = express.Router();
const auth = require("../middleware/auth");
const controllers = require("../controllers/auth.controllers");

// authRouter.post("/signup", controllers.singup);
authRouter.post("/login", controllers.login);
// authRouter.get("/userInfo", auth, controllers.userInfo);
// authRouter.put("/update_user/:id", auth, controllers.userUpdate);

module.exports = authRouter;
