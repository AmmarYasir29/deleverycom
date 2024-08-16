// var admin = require("firebase-admin");

const sendNofi = require("../helper/sendNofi");

// var serviceAccount = require("../helper/push-notifictioan.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

exports.sendNotificaton = async (req, res, next) => {
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
