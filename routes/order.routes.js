const express = require("express");
const orderRoute = express.Router();
const controllers = require("../controllers/order.controllers");
const auth = require("../middleware/auth");

orderRoute.post("/create", auth, controllers.create);
// orderRoute.get("/displayAll", auth, controllers.showOrders);
orderRoute.get("/getOrder", auth, controllers.getOrder);
orderRoute.get("/orderStatus", auth, controllers.OrdersBasedOnStatus);
orderRoute.put("/assignDelegate", auth, controllers.assignOrderDelegate);
orderRoute.put("/guaranteeDelegate", auth, controllers.guaranteeOrderDelegate);
orderRoute.put("/delivered", auth, controllers.orderDelivered);
orderRoute.put("/rejected", auth, controllers.orderRejected);

module.exports = orderRoute;
