const express = require("express");
const extraRoute = express.Router();
const controllers = require("../controllers/extra.controller");

extraRoute.post("/sendNoficiation", controllers.sendNotificaton);

module.exports = extraRoute;
