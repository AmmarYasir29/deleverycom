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
      delegate: {
        select: {
          fullname: true,
          username: true,
          phone: true,
          city: true,
          area: true,
        },
      },
      merchant: {
        select: {
          fullname: true,
          username: true,
          phone: true,
          pageName: true,
          city: true,
          area: true,
          debt: true,
        },
      },
    },
  });
  res.json(order);
};

const OrdersBasedOnStatus = async (req, res) => {
  let orderNumber = req.query.orderNumber ? parseInt(req.query.orderNumber) : 0;
  let status = parseInt(req.query.orderStatus);
  let merchant;
  if (req.user.role == 3)
    merchant = parseInt(req.query.orderMerchant); // super admin
  else if (req.user.role == 1) merchant = parseInt(req.user.id); // merchant
  if (orderNumber != 0) {
    const orders = await prisma.order.findUnique({
      where: {
        id: orderNumber,
      },
      include: {
        delegate: {
          select: {
            fullname: true,
            username: true,
            phone: true,
            city: true,
            area: true,
          },
        },
        merchant: {
          select: {
            fullname: true,
            username: true,
            phone: true,
            pageName: true,
            city: true,
            area: true,
            debt: true,
          },
        },
      },
    });
    return res.json(orders ? orders : []);
  }
  if (merchant == 0 && req.user.role != 3) {
    return res.json({ message: "request just for super ADMIN" });
  } else if (merchant == 0 && req.user.role == 3) {
    if (status == 0) {
      const orders = await prisma.order.findMany({
        include: {
          delegate: {
            select: {
              fullname: true,
              username: true,
              phone: true,
              city: true,
              area: true,
            },
          },
          merchant: {
            select: {
              fullname: true,
              username: true,
              phone: true,
              pageName: true,
              city: true,
              area: true,
              debt: true,
            },
          },
        },
      });
      return res.json(orders);
    } else if (status != 0) {
      const orders = await prisma.order.findMany({
        where: {
          orderStatus: status,
        },
        include: {
          delegate: {
            select: {
              fullname: true,
              username: true,
              phone: true,
              city: true,
              area: true,
            },
          },
          merchant: {
            select: {
              fullname: true,
              username: true,
              phone: true,
              pageName: true,
              city: true,
              area: true,
              debt: true,
            },
          },
        },
      });
      return res.json(orders);
    }
  } else if (merchant != 0) {
    if (status == 0) {
      const orders = await prisma.order.findMany({
        where: {
          merchantId: merchant,
        },
        include: {
          delegate: {
            select: {
              fullname: true,
              username: true,
              phone: true,
              city: true,
              area: true,
            },
          },
          merchant: {
            select: {
              fullname: true,
              username: true,
              phone: true,
              pageName: true,
              city: true,
              area: true,
              debt: true,
            },
          },
        },
      });
      return res.json(orders);
    } else {
      const orders = await prisma.order.findMany({
        where: {
          orderStatus: status,
          merchantId: merchant,
        },
        include: {
          delegate: {
            select: {
              fullname: true,
              username: true,
              phone: true,
              city: true,
              area: true,
            },
          },
          merchant: {
            select: {
              fullname: true,
              username: true,
              phone: true,
              pageName: true,
              city: true,
              area: true,
              debt: true,
            },
          },
        },
      });
      res.json(orders);
    }
  }
};

const assignOrderDelegate = async (req, res) => {
  let delegateId = parseInt(req.query.delegateId);
  let orderId = parseInt(req.query.orderId);
  if (req.user.role != 3)
    return res.json({ message: "assign order just for super admin" });
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
  if (req.user.role != 2)
    return res.json({ message: "guarantee order just for delegate" });
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
  if (req.user.role != 2)
    return res.json({ message: "Delivered order just for delegate" });
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        orderStatus: 4,
      },
    });
    const merchant = await prisma.merchant.update({
      where: { id: order.merchantId },
      data: {
        debt: { increment: order.orderAmount },
      },
    });
    const invoice = await prisma.invoice.create({
      data: {
        amount: order.orderAmount,
        type: 1,
        merchant: {
          connect: {
            id: order.merchantId,
          },
        },
      },
    });
    res.json({ order, merchant });
  } catch (error) {
    res.json({ error: error });
  }
};

const orderRejected = async (req, res) => {
  let orderId = parseInt(req.query.orderId);
  let reason = parseInt(req.body.reason);
  if (req.user.role != 2)
    return res.json({ message: "Rejected order just for delegate" });
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
