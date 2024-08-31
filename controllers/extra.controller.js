const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const sendNofi = require("../helper/sendNofi");
const requestIp = require("request-ip");

const sendNotificaton = async (req, res, next) => {
  let dataObj = {
    orderId: "2222222",
    orderDate: "2020-02-02",
  };
  try {
    let x = await sendNofi(
      "title",
      "body",
      "cTP863XiRY2zbZcBHe65Hj:APA91bFN5fZmnYSWUM0rY1m6UtT1WrWVJv3adSAKwDwx4N6CytrbI0yD_purM8c_C8JTf6rcbiFH-yUYQ7GxPFEf-AfIKHuBXaWFHbPU_vWNgCAY7kVqcjoIdUSls58E8ua3_PM0IVmW"
    );
    console.log(x);

    res.json({ resutlt: x });
  } catch (error) {
    res.status(500).send("Unexpected error: " + error);
  }
};

const auditSys = async (req, res) => {
  let auditRec = await prisma.ApiAuditLog.findMany();
  return res.json(auditRec);
};
const getIp = async (req, res) => {
  res.json({
    socket: req.socket.remoteAddress,
    ipAddress: req.ipAddress,
    clintIP: requestIp.getClientIp(req),
    headerForwared: req.headers["x-forwarded-for"],
  });
};

module.exports = {
  auditSys,
  sendNotificaton,
  getIp,
};
