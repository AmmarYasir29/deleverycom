const express = require("express");
const extraRoute = express.Router();
const controllers = require("../controllers/extra.controller");

extraRoute.post("/sendNoficiation", controllers.sendNotificaton);
extraRoute.get("/auditSys", controllers.auditSys);
extraRoute.get("/new_ip", controllers.getIp);

module.exports = extraRoute;
