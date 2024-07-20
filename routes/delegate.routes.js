const express = require("express");
const delegateRoute = express.Router();
const controllers = require("../controllers/delegate.controllers");
const auth = require("../middleware/auth");

delegateRoute.post("/create", auth, controllers.createdelegate);
delegateRoute.get("/displayAll", auth, controllers.showdelegate);

module.exports = delegateRoute;
