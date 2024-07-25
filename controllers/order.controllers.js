const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const create = async (req, res) => {
  const {
    customerName = "",
    customerPhone = "",
    customerPhone2 = "",
    customerLat = "",
    customerLong = "",
    city = "",
    area = "",
    nearestPoint = "",
    orderAmount = 0,
    orderCount = 0,
    notes = "",
    // reason = "",
  } = req.body;

  if (req.user.role == 3) {
    return res.json({ message: "create order just for merchant" }); // super admin
  } else if (req.user.role == 1) merchantId = parseInt(req.user.id); // merchant

  const newOrder = await prisma.order.create({
    data: {
      customerName,
      customerPhone,
      customerPhone2,
      customerLat,
      customerLong,
      city,
      area,
      nearestPoint,
      orderAmount,
      orderCount,
      orderStatus: 1,
      notes,
      // reason,
      merchant: {
        connect: {
          id: merchantId,
        },
      },
      // delegate: {
      //   connect: {
      //     id: 1, // Replace with the existing delegate ID you want to associate
      //   },
      // },
    },
  });
  res.json(newOrder);
};

// const showOrders = async (req, res) => {
//   const orders = await prisma.order.findMany({
//     include: {
//       merchant: true,
//       delegate: true,
//     },
//   });
//   res.json(orders);
// };

const getOrder = async (req, res) => {
  orderId = parseInt(req.query.orderId);
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      merchant: true,
      delegate: true,
    },
  });
  res.json(order);
};

const OrdersBasedOnStatus = async (req, res) => {
  let status = parseInt(req.query.orderStatus);
  let orderNumber = req.query.orderNumber ? parseInt(req.query.orderNumber) : 0;
  let merchant;
  if (req.user.role == 3) {
    merchant = parseInt(req.query.orderMerchant); // super admin
  } else if (req.user.role == 1) merchant = parseInt(req.user.id); // merchant
  if (orderNumber != 0) {
    const orders = await prisma.order.findUnique({
      where: {
        id: orderNumber,
      },
      include: { delegate: true, merchant: true },
    });
    return res.json(orders);
  }
  if (status == 0) {
    if (merchant == 0) {
      if (req.user.role != 3)
        return res.json({ message: "request just for super ADMIN" });
      const orders = await prisma.order.findMany({
        include: { delegate: true, merchant: true },
      });
      return res.json(orders);
    } else if (merchant != 0) {
      const orders = await prisma.order.findMany({
        where: {
          merchantId: merchant,
        },
        include: { delegate: true, merchant: true },
      });
      return res.json(orders);
    }
  } else {
    const orders = await prisma.order.findMany({
      where: {
        orderStatus: status,
        merchantId: merchant,
      },
      include: { delegate: true, merchant: true },
    });
    res.json(orders);
  }
};

const assignOrderDelegate = async (req, res) => {
  let delegateId = parseInt(req.query.delegateId);
  let orderId = parseInt(req.query.orderId);
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        delegateId: delegateId,
        orderStatus: 2,
      },
    });

    res.json(order);
  } catch (error) {
    res.json({ error: error });
  }
};

const guaranteeOrderDelegate = async (req, res) => {
  let orderId = parseInt(req.query.orderId);
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        orderStatus: 3,
      },
    });

    res.json(order);
  } catch (error) {
    res.json({ error: error });
  }
};

const orderDelivered = async (req, res) => {
  let orderId = parseInt(req.query.orderId);
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        orderStatus: 4,
      },
    });
    res.json(order);
  } catch (error) {
    res.json({ error: error });
  }
};

const orderRejected = async (req, res) => {
  let orderId = parseInt(req.query.orderId);
  let reason = parseInt(req.body.reason);

  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        orderStatus: 5,
        reason,
      },
    });
    res.json(order);
  } catch (error) {
    res.json({ error: error });
  }
};
module.exports = {
  create,
  // showOrders,
  getOrder,
  OrdersBasedOnStatus,
  assignOrderDelegate,
  guaranteeOrderDelegate,
  orderDelivered,
  orderRejected,
};
