const express = require("express");
const orderRoute = express.Router();
const controllers = require("../controllers/order.controllers");

orderRoute.post("/create", controllers.create);
// orderRoute.get("/displayAll", controllers.showOrders);
orderRoute.get("/getOrder", controllers.getOrder);
orderRoute.get("/orderStatus", controllers.OrdersBasedOnStatus);
orderRoute.put("/assignDelegate", controllers.assignOrderDelegate);
orderRoute.put("/guaranteeDelegate", controllers.guaranteeOrderDelegate);
orderRoute.put("/delivered", controllers.orderDelivered);
orderRoute.put("/rejected", controllers.orderRejected);
orderRoute.put("/processOrder", controllers.processOrder);
orderRoute.put("/revert", controllers.orderReverted);
orderRoute.get("/orderHis", controllers.orderHistory);

module.exports = orderRoute;
