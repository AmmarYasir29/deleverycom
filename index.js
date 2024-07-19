const express = require("express");
const bodyParser = require("body-parser");
const authRoute = require("./routes/auth.routes");
const merchantRoute = require("./routes/merchant.routes");
const delegateRoute = require("./routes/delegate.routes");

const port = process.env.PORT || 3000;
const app = express();
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/auth", authRoute);
app.use("/api/merchant", merchantRoute);
app.use("/api/delegate", delegateRoute);
// app.use("/api/admin", adminRouter);

// app.use(ErrorHandler);

// app.post(`/createMerchant`, async (req, res) => {
//   const {
//     fullname = "",
//     username = "",
//     phone = "",
//     pageName = "",
//     lat = "",
//     long = "",
//     debt = 0,
//     city = "",
//     password = "1",
//   } = req.body;
//   const newMerchant = await prisma.Merchant.create({
//     data: {
//       fullname,
//       username,
//       phone,
//       pageName,
//       lat,
//       long,
//       debt,
//       city,
//       password,
//     },
//   });
//   res.json(newMerchant);
// });

app.get("/", async (req, res) => {
  res.send("worked!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
