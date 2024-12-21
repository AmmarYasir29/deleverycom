const express = require("express");
const merchantRoute = express.Router();
const controllers = require("../controllers/merchant.controllers");

merchantRoute.post("/create", controllers.createMerchant);
merchantRoute.get("/displayAll", controllers.showMerchants);
merchantRoute.get("/displayDebt", controllers.showDebt); // Main page
merchantRoute.get("/displayStatements", controllers.showStatements);
merchantRoute.put("/requestDebt", controllers.requestDebt); // request the debt
merchantRoute.get("/displayAllDebt", controllers.showReqDebt); // display who requested the debt
merchantRoute.put("/acceptDebtReq", controllers.givenDebt); // accept the request for the debt
merchantRoute.put("/updateMerInfo", controllers.updateMerInfo);
merchantRoute.get("/debtHistory", controllers.debtHistory);

module.exports = merchantRoute;
