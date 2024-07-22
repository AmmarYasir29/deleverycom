const express = require("express");
const merchantRoute = express.Router();
const controllers = require("../controllers/merchant.controllers");
const auth = require("../middleware/auth");

merchantRoute.post("/create", auth, controllers.createMerchant);
merchantRoute.get("/displayAll", auth, controllers.showMerchants);
merchantRoute.get("/displayDebt", auth, controllers.showDebt);
merchantRoute.get("/displayStatements", auth, controllers.showStatements);

module.exports = merchantRoute;
