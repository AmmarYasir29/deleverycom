const express = require("express");
const merchantRoute = express.Router();
const controllers = require("../controllers/merchant.controllers");

merchantRoute.post("/create", controllers.createMerchant);
merchantRoute.get("/displayAll", controllers.showMerchants);

module.exports = merchantRoute;
