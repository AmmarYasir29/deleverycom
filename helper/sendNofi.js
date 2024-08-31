var admin = require("firebase-admin");

var serviceAccount = require("./push-notifictioan.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendNofi = async (title, body, fcmToken) => {
  const message = {
    notification: {
      title,
      body,
    },
    token: fcmToken,
  };

  // let msg = {
  //   notification: {
  //     title,
  //     body,
  //   },
  //   data: {
  //     orderId: data.orderId,
  //     orderDate: data.orderDate,
  //   },
  //   token: fcmToken,
  // };
  try {
    const response = await admin.messaging().send(message);
    return `Notification sent successfully:  ${response}`;
  } catch (error) {
    return "Unexpected error: " + error.message;
  }
};

module.exports = sendNofi;
