// import * as dotenv from "dotenv";
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const authRoute = require("./routes/auth.routes");
const merchantRoute = require("./routes/merchant.routes");
const delegateRoute = require("./routes/delegate.routes");
const orderRoute = require("./routes/order.routes");
const errorHandler = require("./middleware/errorMiddleware");
const auth = require("./middleware/auth");
const extraRoute = require("./routes/extra.routes");
const auditMiddleware = require("./middleware/auditMiddleware");

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(auditMiddleware);

app.use("/api/auth", authRoute);
app.use(auth);
app.use("/api/merchant", merchantRoute);
app.use("/api/delegate", delegateRoute);
app.use("/api/order", orderRoute);
app.use("/api/ohter", extraRoute);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
