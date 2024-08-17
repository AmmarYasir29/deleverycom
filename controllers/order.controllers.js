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
  let merchantId;
  if (req.user.role != 1) {
    return res.json({ message: "create order just for merchant" });
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
  const orderHis = await prisma.orderHistory.create({
    data: {
      orderId: newOrder.id,
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
  if (req.user.role != 2)
    return res.json({ message: "must be login as delegate" });

  const delegate = await prisma.delegate.findUnique({
    where: {
      id: req.user.id,
    },
  });

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
        },
      },
    },
  });
  if (!order) return res.json([]);
  else if (delegate.id == order.delegateId) return res.json(order);
  else return res.json({ message: "the order not belong to other delegate" });
};

const OrdersBasedOnStatus = async (req, res) => {
  const take = parseInt(req.query.PAGE_SIZE) || 25;
  const pageNumber = parseInt(req.query.pageNumber) || 0;
  const skip = (pageNumber - 1) * take;

  let orderNumber = req.query.orderNumber ? parseInt(req.query.orderNumber) : 0;
  let status = parseInt(req.query.orderStatus);
  let merchant;
  if (req.user.role == 3)
    merchant = parseInt(req.query.orderMerchant); // super admin
  else if (req.user.role == 1) merchant = parseInt(req.user.id); // merchant
  if (orderNumber != 0) {
    const orders = await prisma.order.findMany({
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
          },
        },
      },
    });
    return res.json(orders ? { data: orders } : []);
  }
  if (merchant == 0 && req.user.role != 3) {
    return res.status(400).json({ message: "request just for super ADMIN" });
  } else if (merchant == 0 && req.user.role == 3) {
    if (status == 0) {
      const orders = await prisma.order.findMany({
        take,
        skip,
        orderBy: {
          id: "asc",
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
            },
          },
        },
      });
      const total = await prisma.order.count();

      return res.json({
        data: orders,
        metadata: {
          hasNextPage: skip + take < total,
          totalPages: Math.ceil(total / take),
        },
      });
    } else if (status != 0) {
      const orders = await prisma.order.findMany({
        take,
        skip,
        orderBy: {
          id: "asc",
        },
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
            },
          },
        },
      });
      const total = await prisma.order.count({
        where: {
          orderStatus: status,
        },
      });

      return res.json({
        data: orders,
        metadata: {
          hasNextPage: skip + take < total,
          totalPages: Math.ceil(total / take),
        },
      });
    }
  } else if (merchant != 0 && req.user.role == 3) {
    if (status == 0) {
      const orders = await prisma.order.findMany({
        take,
        skip,
        orderBy: {
          id: "asc",
        },
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
            },
          },
        },
      });
      const total = await prisma.order.count({
        where: {
          merchantId: merchant,
        },
      });

      return res.json({
        data: orders,
        metadata: {
          hasNextPage: skip + take < total,
          totalPages: Math.ceil(total / take),
        },
      });
    } else {
      const orders = await prisma.order.findMany({
        take,
        skip,
        orderBy: {
          id: "asc",
        },
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
            },
          },
        },
      });

      const total = await prisma.order.count({
        where: {
          orderStatus: status,
          merchantId: merchant,
        },
      });

      res.json({
        data: orders,
        metadata: {
          hasNextPage: skip + take < total,
          totalPages: Math.ceil(total / take),
        },
      });
    }
  } else if (merchant != 0 && req.user.role == 1) {
    if (status == 0) {
      const orders = await prisma.order.findMany({
        take,
        skip,
        orderBy: {
          id: "asc",
        },
        where: {
          NOT: {
            orderStatus: 5,
          },
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
            },
          },
        },
      });
      const total = await prisma.order.count({
        where: {
          merchantId: merchant,
        },
      });

      return res.json({
        data: orders,
        metadata: {
          hasNextPage: skip + take < total,
          totalPages: Math.ceil(total / take),
        },
      });
    } else {
      const orders = await prisma.order.findMany({
        take,
        skip,
        orderBy: {
          id: "asc",
        },
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
            },
          },
        },
      });

      const total = await prisma.order.count({
        where: {
          orderStatus: status,
          merchantId: merchant,
        },
      });

      res.json({
        data: orders,
        metadata: {
          hasNextPage: skip + take < total,
          totalPages: Math.ceil(total / take),
        },
      });
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

    const orderHis = await prisma.orderHistory.create({
      data: {
        orderId: order.id,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerPhone2: order.customerPhone2,
        customerLat: order.customerLat,
        customerLong: order.customerLong,
        city: order.city,
        area: order.area,
        nearestPoint: order.nearestPoint,
        orderAmount: order.orderAmount,
        orderCount: order.orderCount,
        orderStatus: 2,
        notes: order.notes,
        // reason,
        merchant: {
          connect: {
            id: order.merchantId,
          },
        },
        delegate: {
          connect: {
            id: delegateId,
          },
        },
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

    const orderHis = await prisma.orderHistory.create({
      data: {
        orderId: order.id,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerPhone2: order.customerPhone2,
        customerLat: order.customerLat,
        customerLong: order.customerLong,
        city: order.city,
        area: order.area,
        nearestPoint: order.nearestPoint,
        orderAmount: order.orderAmount,
        orderCount: order.orderCount,
        orderStatus: 3,
        notes: order.notes,
        // reason,
        merchant: {
          connect: {
            id: order.merchantId,
          },
        },
        delegate: {
          connect: {
            id: order.delegateId,
          },
        },
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

    const orderHis = await prisma.orderHistory.create({
      data: {
        orderId: order.id,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerPhone2: order.customerPhone2,
        customerLat: order.customerLat,
        customerLong: order.customerLong,
        city: order.city,
        area: order.area,
        nearestPoint: order.nearestPoint,
        orderAmount: order.orderAmount,
        orderCount: order.orderCount,
        orderStatus: 4,
        notes: order.notes,
        // reason,
        merchant: {
          connect: {
            id: order.merchantId,
          },
        },
        delegate: {
          connect: {
            id: order.delegateId,
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

    const orderHis = await prisma.orderHistory.create({
      data: {
        orderId: order.id,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerPhone2: order.customerPhone2,
        customerLat: order.customerLat,
        customerLong: order.customerLong,
        city: order.city,
        area: order.area,
        nearestPoint: order.nearestPoint,
        orderAmount: order.orderAmount,
        orderCount: order.orderCount,
        orderStatus: 5,
        notes: order.notes,
        // reason,
        merchant: {
          connect: {
            id: order.merchantId,
          },
        },
        delegate: {
          connect: {
            id: order.delegateId,
          },
        },
      },
    });
    res.json(order);
  } catch (error) {
    res.json({ error: error });
  }
};

const processOrder = async (req, res) => {
  let orderId = parseInt(req.query.orderId);
  let newData = req.body;
  if (req.user.role != 3)
    return res.json({ message: "edit order just for admin" });

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: newData,
  });

  const orderHis = await prisma.orderHistory.create({
    data: {
      orderId: updatedOrder.id,
      customerName: updatedOrder.customerName,
      customerPhone: updatedOrder.customerPhone,
      customerPhone2: updatedOrder.customerPhone2,
      customerLat: updatedOrder.customerLat,
      customerLong: updatedOrder.customerLong,
      city: updatedOrder.city,
      area: updatedOrder.area,
      nearestPoint: updatedOrder.nearestPoint,
      orderAmount: updatedOrder.orderAmount,
      orderCount: updatedOrder.orderCount,
      orderStatus: 2,
      notes: updatedOrder.notes,
      // reason,
      merchant: {
        connect: {
          id: updatedOrder.merchantId,
        },
      },
      delegate: {
        connect: {
          id: updatedOrder.delegateId,
        },
      },
    },
  });
  return res.json(updatedOrder);
};

const orderReverted = async (req, res) => {
  let orderId = parseInt(req.query.orderId);
  if (req.user.role != 3)
    return res.json({ message: "Reverted order just for admin" });
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        orderStatus: 6,
      },
    });

    const orderHis = await prisma.orderHistory.create({
      data: {
        orderId: order.id,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerPhone2: order.customerPhone2,
        customerLat: order.customerLat,
        customerLong: order.customerLong,
        city: order.city,
        area: order.area,
        nearestPoint: order.nearestPoint,
        orderAmount: order.orderAmount,
        orderCount: order.orderCount,
        orderStatus: 6,
        notes: order.notes,
        // reason,
        merchant: {
          connect: {
            id: order.merchantId,
          },
        },
        delegate: {
          connect: {
            id: order.delegateId,
          },
        },
      },
    });
    res.json(order);
  } catch (error) {
    res.json({ error: error });
  }
};

const orderHistory = async (req, res) => {
  if (req.user.role != 3) return res.json({ message: "must be admin" });

  if (req.query.orderId == null)
    return res.json({ message: "order id require" });
  let orderId = parseInt(req.query.orderId);

  const orderHis = await prisma.orderHistory.findMany({
    where: {
      orderId,
    },
    select: {
      orderStatus: true,
      createAt: true,
    },
    // include: {
    //   delegate: {
    //     select: {
    //       fullname: true,
    //       // username: true,
    //       phone: true,
    //       city: true,
    //       // area: true,
    //     },
    //   },
    // merchant: {
    //   select: {
    //     fullname: true,
    //     // username: true,
    //     phone: true,
    //     // pageName: true,
    //     city: true,
    //     // area: true,
    //   },
    // },
    // },
    orderBy: [
      {
        createAt: "desc",
      },
    ],
  });
  if (!orderHis) return res.json([]);
  return res.json(orderHis);
};

const editOrder = async (req, res) => {
  if (req.user.role != 1) return res.json({ message: "must be merchant" });

  if (!req.query.orderId) return res.json({ message: "enter orderId" });
  let orderId = parseInt(req.query.orderId);
  const {
    // customerName = "",
    customerPhone,
    customerPhone2,
    customerLat,
    customerLong,
    // city = "",
    // area = "",
    // nearestPoint = "",
    // orderAmount = 0,
    // orderCount = 0,
    // notes = "",
    // reason = "",
  } = req.body;

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      customerPhone,
      customerPhone2,
      customerLat,
      customerLong,
    },
  });

  const orderHis = await prisma.orderHistory.create({
    data: {
      orderId: updatedOrder.id,
      customerName: updatedOrder.customerName,
      customerPhone: updatedOrder.customerPhone,
      customerPhone2: updatedOrder.customerPhone2,
      customerLat: updatedOrder.customerLat,
      customerLong: updatedOrder.customerLong,
      city: updatedOrder.city,
      area: updatedOrder.area,
      nearestPoint: updatedOrder.nearestPoint,
      orderAmount: updatedOrder.orderAmount,
      orderCount: updatedOrder.orderCount,
      orderStatus: updatedOrder.orderStatus,
      notes: updatedOrder.notes,
      // reason,
      merchant: {
        connect: {
          id: updatedOrder.merchantId,
        },
      },
      // delegate: {
      //   connect: {
      //     id: updatedOrder.delegateId?,
      //   },
      // },
    },
  });
  return res.json(updatedOrder);
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
  processOrder,
  orderReverted,
  orderHistory,
  editOrder,
};
