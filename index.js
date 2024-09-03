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
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();
const cors = require("cors");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
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
// io.use(auth.authenticateSocket);
app.use(errorHandler);

io.on("connection", socket => {
  console.log("a user connected");
  io.emit("ammar", {
    message: "res: " + socket,
  });
});

app.set("socketio", io);

server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });
