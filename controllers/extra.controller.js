const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const sendNofi = require("../helper/sendNofi");

const sendNotificaton = async (req, res, next) => {
  let dataObj = {
    orderId: "2222222",
    orderDate: "2020-02-02",
  };
  try {
    let x = await sendNofi("title", "body", dataObj, req.user.fcmToken);
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
module.exports = {
  auditSys,
  sendNotificaton,
};
