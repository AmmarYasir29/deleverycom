var admin = require("firebase-admin");

var serviceAccount = require("./push-notifictioan.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendNofi = async (title, body, data, fcmToken) => {
  let msg = {
    notification: {
      title,
      body,
    },
    data: {
      orderId: data.orderId,
      orderDate: data.orderDate,
    },
    token: fcmToken,
  };
  console.log(title, body, data);

  //let notif =
  await admin
    .messaging()
    .send(msg)
    .then(response => {
      console.log(response);
      return `Notification sent successfully:  ${response}`;
    })
    .catch(error => {
      console.log(error.message);
      return "Unexpected error: " + error.message;
    });
};

module.exports = sendNofi;
