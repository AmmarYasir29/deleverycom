const express = require("express");
const orderRoute = express.Router();
const controllers = require("../controllers/order.controllers");

orderRoute.post("/create", controllers.create);
orderRoute.put("/taked", controllers.takedOrder);
orderRoute.put("/assignDelegate", controllers.assignOrderDelegate);
orderRoute.put("/guaranteeDelegate", controllers.guaranteeOrderDelegate);
orderRoute.put("/delivered", controllers.orderDelivered);
orderRoute.put("/rejected", controllers.orderRejected);
// orderRoute.put("/revert", controllers.orderReverted);
orderRoute.put("/processOrder", controllers.processOrder);
// orderRoute.put("/receiptNum", controllers.addReceiptNum);
orderRoute.put("/marEditOrder", controllers.editOrderMer);
orderRoute.get("/orderHis", controllers.orderHistory);
orderRoute.get("/getOrder", controllers.getOrder);
orderRoute.get("/orderStatus", controllers.OrdersBasedOnStatus);
// orderRoute.put("/editOrderAdmin", controllers.editOrderAdmin);
// orderRoute.get("/displayAll", controllers.showOrders);

module.exports = orderRoute;
