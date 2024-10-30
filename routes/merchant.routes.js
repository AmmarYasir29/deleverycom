const express = require("express");
const merchantRoute = express.Router();
const controllers = require("../controllers/merchant.controllers");

merchantRoute.post("/create", controllers.createMerchant);
merchantRoute.get("/displayAll", controllers.showMerchants);
merchantRoute.get("/displayAllDebt", controllers.showReqDebt);
merchantRoute.put("/acceptDebtReq", controllers.givenDebt);
merchantRoute.get("/displayDebt", controllers.showDebt);
merchantRoute.get("/displayStatements", controllers.showStatements);
merchantRoute.put("/requestDebt", controllers.requestDebt);
merchantRoute.put("/updateMerInfo", controllers.updateMerInfo);

module.exports = merchantRoute;
