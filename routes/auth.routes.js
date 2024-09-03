const express = require("express");
const authRouter = express.Router();
const controllers = require("../controllers/auth.controllers");

authRouter.post("/login", controllers.login);

module.exports = authRouter;
