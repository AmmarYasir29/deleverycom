const express = require("express");
const delegateRoute = express.Router();
const controllers = require("../controllers/delegate.controllers");

delegateRoute.post("/create", controllers.createdelegate);
delegateRoute.get("/displayAll", controllers.showdelegate);

module.exports = delegateRoute;
