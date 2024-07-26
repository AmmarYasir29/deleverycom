const express = require("express");
const bodyParser = require("body-parser");
const authRoute = require("./routes/auth.routes");
const merchantRoute = require("./routes/merchant.routes");
const delegateRoute = require("./routes/delegate.routes");
const orderRoute = require("./routes/order.routes");
const errorHandler = require("./middleware/errorMiddleware");
const { tryCatch } = require("./helper/tryCatch");
const AppError = require("./helper/AppError");
const auth = require("./middleware/auth");

const port = process.env.PORT || 3000;
const app = express();
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const getUser = () => undefined;
app.get(
  "/",
  tryCatch((req, res) => {
    const user = getUser();
    if (!user) throw new Error("user- known error");
    res.status(200).send("worked!");
  })
);

app.use("/api/auth", authRoute);
app.use(auth);
app.use("/api/merchant", merchantRoute);
app.use("/api/delegate", delegateRoute);
app.use("/api/order", orderRoute);
// app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
