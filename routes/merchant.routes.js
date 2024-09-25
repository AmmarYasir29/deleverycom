const express = require("express");
const merchantRoute = express.Router();
const controllers = require("../controllers/merchant.controllers");

merchantRoute.post("/create", controllers.createMerchant);
merchantRoute.get("/displayAll", controllers.showMerchants);
merchantRoute.get("/displayDebt", controllers.showDebt);
merchantRoute.get("/displayStatements", controllers.showStatements);
merchantRoute.put("/requestDebt", controllers.requestDebt);
merchantRoute.get("/displayAllDebt", controllers.showDebt);
merchantRoute.put("/acceptDebtReq", controllers.givenDebt);

module.exports = merchantRoute;
