const express = require("express");
const orderRoute = express.Router();
const controllers = require("../controllers/order.controllers");

orderRoute.post("/create", controllers.create);
// orderRoute.get("/displayAll", controllers.showOrders);
orderRoute.get("/orderStatus", controllers.OrdersBasedOnStatus);
orderRoute.put("/assignDelegate", controllers.assignOrderDelegate);
orderRoute.put("/processOrder", controllers.processOrder);
orderRoute.put("/guaranteeDelegate", controllers.guaranteeOrderDelegate);
orderRoute.put("/rejected", controllers.orderRejected);
orderRoute.put("/delivered", controllers.orderDelivered);
orderRoute.put("/marEditOrder", controllers.editOrderMer);
orderRoute.put("/revert", controllers.orderReverted);
orderRoute.get("/getOrder", controllers.getOrder);
orderRoute.get("/orderHis", controllers.orderHistory);
orderRoute.put("/receiptNum", controllers.addReceiptNum);
// orderRoute.put("/editOrderAdmin", controllers.editOrderAdmin);

module.exports = orderRoute;
