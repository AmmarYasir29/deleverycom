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
    orderAmount = 0,
    orderCount = 0,
    notes = "",
    // reason = "",
    merchantId = 3,
  } = req.body;

  const newOrder = await prisma.order.create({
    data: {
      customerName,
      customerPhone,
      customerPhone2,
      customerLat,
      customerLong,
      city,
      area,
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

const showOrders = async (req, res) => {
  const orders = await prisma.order.findMany({
    include: {
      merchant: true,
      delegate: true,
    },
  });
  res.json(orders);
};

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
  let Merchant = parseInt(req.query.orderMerchant);
  // if(status == 0){
  //   const orders = await prisma.order.findMany({
  //     where: {
  //       orderStatus: status,
  //       merchantId: Merchant,
  //     },
  //     include: { delegate: true },
  //   });
  //   res.json(orders);
  // }
  const orders = await prisma.order.findMany({
    where: {
      orderStatus: status,
      merchantId: Merchant,
    },
    include: { delegate: true },
  });
  res.json(orders);
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
  showOrders,
  getOrder,
  OrdersBasedOnStatus,
  assignOrderDelegate,
  guaranteeOrderDelegate,
  orderDelivered,
  orderRejected,
};
