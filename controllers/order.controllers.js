const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const sendNofi = require("../helper/sendNofi");
const AppError = require("../helper/AppError");
const errorCode = require("../helper/errorCode");
const PrismaError = require("../helper/PrismaError");

const create = async (req, res, next) => {
  const {
    customerName,
    customerPhone,
    customerPhone2,
    customerLat = "0",
    customerLong = "0",
    city,
    area,
    nearestPoint,
    orderAmount,
    orderCount,
    notes,
    // reason = "",
  } = req.body;
  let merchantId;
  const io = req.app.get("socketio");
  if (req.user.role != 1) {
    throw new AppError("ليس لديك صلاحية", 401, 401);
  } else if (req.user.role == 1) merchantId = parseInt(req.user.id); // merchant
  try {
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
      },
    });

    // io.emit("createdOrder", {
    //   message: "تم انشاء طلب جديد برقم: " + order.id,
    // });
    io.emit("refresh", {
      message: "تم انشاء طلب جديد برقم: تحربة" + order.id,
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
      },
    });

    res.status(200).json(newOrder);
  } catch (e) {
    if (e instanceof AppError) {
      next(new AppError("Validation Error", e.name, e.code, e.errorCode));
    } else if (
      e instanceof Prisma.PrismaClientKnownRequestError ||
      e instanceof Prisma.PrismaClientInitializationError
    ) {
      let msg = errorCode(`${e.code || e.errorCode}`);
      next(
        new PrismaError(e.name, msg, 400, (errCode = e.code || e.errorCode))
      );
    } else if (
      e instanceof Prisma.PrismaClientUnknownRequestError ||
      e instanceof Prisma.PrismaClientRustPanicError ||
      e instanceof Prisma.PrismaClientValidationError
    ) {
      let msg = e.message.split("Argument");
      next(new PrismaError(e.name, msg[1], 406, 406));
    }
  }
};

const getOrder = async (req, res) => {
  if (req.user.role != 2) throw new AppError("ليس لديك صلاحية", 401, 401);

  try {
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
    else throw new AppError("ليس لديك صلاحية", 401, 401);
  } catch (e) {
    if (e instanceof AppError) {
      next(new AppError("Validation Error", e.name, e.code, e.errorCode));
    } else if (
      e instanceof Prisma.PrismaClientKnownRequestError ||
      e instanceof Prisma.PrismaClientInitializationError
    ) {
      let msg = errorCode(`${e.code || e.errorCode}`);
      next(
        new PrismaError(e.name, msg, 400, (errCode = e.code || e.errorCode))
      );
    } else if (
      e instanceof Prisma.PrismaClientUnknownRequestError ||
      e instanceof Prisma.PrismaClientRustPanicError ||
      e instanceof Prisma.PrismaClientValidationError
    ) {
      let msg = e.message.split("Argument");
      next(new PrismaError(e.name, msg[1], 406, 406));
    }
  }
};

const OrdersBasedOnStatus = async (req, res) => {
  const take = parseInt(req.query.PAGE_SIZE) || 25;
  const pageNumber = parseInt(req.query.pageNumber) || 0;
  const skip = (pageNumber - 1) * take;
  let orderNumber = req.query.orderNumber ? parseInt(req.query.orderNumber) : 0;
  let status = parseInt(req.query.orderStatus);

  let merchant;
  let delegate;
  if (req.user.role == 3 || req.user.role == 4) {
    merchant = parseInt(req.query.orderMerchant); // super admin
    delegate = parseInt(req.query.orderDelegate); // super admin
  } else if (req.user.role == 1) merchant = parseInt(req.user.id); // merchant
  else if (req.user.role == 2) delegate = parseInt(req.user.id); // delegate
  try {
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

    if (req.user.role == 2) {
      // delegate
      if (delegate == 0 || merchant != undefined)
        throw new AppError("ليس لديك صلاحية", 401, 401);
      else if (delegate != 0) {
        if (status == 0) {
          const orders = await prisma.order.findMany({
            take,
            skip,
            orderBy: {
              id: "asc",
            },
            where: {
              delegateId: delegate,
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
              delegateId: delegate,
            },
          });

          return res.json({
            data: orders || [],
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
              delegateId: delegate,
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
              delegateId: delegate,
            },
          });

          return res.json({
            data: orders || [],
            metadata: {
              hasNextPage: skip + take < total,
              totalPages: Math.ceil(total / take),
            },
          });
        }
      }
    } else if (req.user.role == 1) {
      // merchant
      if (merchant == 0 || delegate != undefined) {
        throw new AppError("ليس لديك صلاحية", 401, 401);
      } else if (merchant != 0) {
        if (status == 0) {
          const orders = await prisma.order.findMany({
            take,
            skip,
            orderBy: {
              orderStatus: "desc",
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
            data: orders || [],
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
            data: orders || [],
            metadata: {
              hasNextPage: skip + take < total,
              totalPages: Math.ceil(total / take),
            },
          });
        }
      }
    } else if (req.user.role == 3 || req.user.role == 4) {
      // admin

      if ((isNaN(merchant) && isNaN(delegate)) || (merchant && delegate)) {
        throw new AppError("يجب ارسال قيمة للتاجر او المندوب", 406, 406);
      } else if (merchant == 0 && isNaN(delegate)) {
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
            data: orders || [],
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
            data: orders || [],
            metadata: {
              hasNextPage: skip + take < total,
              totalPages: Math.ceil(total / take),
            },
          });
        }
      } else if (merchant != 0 && isNaN(delegate)) {
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
            data: orders || [],
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
            data: orders || [],
            metadata: {
              hasNextPage: skip + take < total,
              totalPages: Math.ceil(total / take),
            },
          });
        }
      } else if (isNaN(merchant) && delegate == 0) {
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
            data: orders || [],
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
            data: orders || [],
            metadata: {
              hasNextPage: skip + take < total,
              totalPages: Math.ceil(total / take),
            },
          });
        }
      } else if (isNaN(merchant) && delegate != 0) {
        if (status == 0) {
          const orders = await prisma.order.findMany({
            take,
            skip,
            orderBy: {
              id: "asc",
            },
            where: {
              delegateId: delegate,
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
              delegateId: delegate,
            },
          });

          return res.json({
            data: orders || [],
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
              delegateId: delegate,
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
              delegateId: delegate,
            },
          });

          res.json({
            data: orders || [],
            metadata: {
              hasNextPage: skip + take < total,
              totalPages: Math.ceil(total / take),
            },
          });
        }
      }
    }
  } catch (e) {
    if (e instanceof AppError) {
      next(new AppError("Validation Error", e.name, e.code, e.errorCode));
    } else if (
      e instanceof Prisma.PrismaClientKnownRequestError ||
      e instanceof Prisma.PrismaClientInitializationError
    ) {
      let msg = errorCode(`${e.code || e.errorCode}`);
      next(
        new PrismaError(e.name, msg, 400, (errCode = e.code || e.errorCode))
      );
    } else if (
      e instanceof Prisma.PrismaClientUnknownRequestError ||
      e instanceof Prisma.PrismaClientRustPanicError ||
      e instanceof Prisma.PrismaClientValidationError
    ) {
      let msg = e.message.split("Argument");
      next(new PrismaError(e.name, msg[1], 406, 406));
    }
  }
};

const assignOrderDelegate = async (req, res) => {
  let delegateId = parseInt(req.query.delegateId);
  let orderId = parseInt(req.query.orderId);
  const io = req.app.get("socketio");

  try {
    if (req.user.role != 3) throw new AppError("ليس لديك صلاحية", 401, 401);
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        delegateId: delegateId,
        orderStatus: 2,
      },
    });
    const dele = await prisma.delegate.findUnique({
      where: { id: order.delegateId },
    });
    if (dele.fcmToken)
      await sendNofi(
        "عهدة المندوب تجربة",
        "لديك طلب يحتاج الى استلام",
        dele.fcmToken
      );
    // io.emit("refresh", {
    //   message: "تم تكليف مندوب بطلب جديد من قبل الشركة: " + order.id,
    // });
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
  } catch (e) {
    if (e instanceof AppError) {
      next(new AppError("Validation Error", e.name, e.code, e.errorCode));
    } else if (
      e instanceof Prisma.PrismaClientKnownRequestError ||
      e instanceof Prisma.PrismaClientInitializationError
    ) {
      let msg = errorCode(`${e.code || e.errorCode}`);
      next(
        new PrismaError(e.name, msg, 400, (errCode = e.code || e.errorCode))
      );
    } else if (
      e instanceof Prisma.PrismaClientUnknownRequestError ||
      e instanceof Prisma.PrismaClientRustPanicError ||
      e instanceof Prisma.PrismaClientValidationError
    ) {
      let msg = e.message.split("Argument");
      next(new PrismaError(e.name, msg[1], 406, 406));
    }
  }
};

const guaranteeOrderDelegate = async (req, res) => {
  let orderId = parseInt(req.query.orderId);
  const io = req.app.get("socketio");
  try {
    if (req.user.role != 2) throw new AppError("ليس لديك صلاحية", 401, 401);

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        orderStatus: 3,
      },
    });
    // io.emit("guaranteeOrder", {
    //   message: "تم استلام الطلب من قبل المندوب: " + order.id,
    // });
    io.emit("refresh", {
      message: " تم استلام الطلب من قبل المندوب :تحربة" + order.id,
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
  } catch (e) {
    if (e instanceof AppError) {
      next(new AppError("Validation Error", e.name, e.code, e.errorCode));
    } else if (
      e instanceof Prisma.PrismaClientKnownRequestError ||
      e instanceof Prisma.PrismaClientInitializationError
    ) {
      let msg = errorCode(`${e.code || e.errorCode}`);
      next(
        new PrismaError(e.name, msg, 400, (errCode = e.code || e.errorCode))
      );
    } else if (
      e instanceof Prisma.PrismaClientUnknownRequestError ||
      e instanceof Prisma.PrismaClientRustPanicError ||
      e instanceof Prisma.PrismaClientValidationError
    ) {
      let msg = e.message.split("Argument");
      next(new PrismaError(e.name, msg[1], 406, 406));
    }
  }
};

const orderDelivered = async (req, res, next) => {
  let orderId = parseInt(req.query.orderId);
  try {
    if (req.user.role != 2) throw new AppError("ليس لديك صلاحية", 401, 401);

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
    io.emit("refresh", {
      message: "تم ايصال الطلب بنجاح تجربة" + order.id,
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
  } catch (e) {
    if (e instanceof AppError) {
      next(new AppError("Validation Error", e.name, e.code, e.errorCode));
    } else if (
      e instanceof Prisma.PrismaClientKnownRequestError ||
      e instanceof Prisma.PrismaClientInitializationError
    ) {
      let msg = errorCode(`${e.code || e.errorCode}`);
      next(
        new PrismaError(e.name, msg, 400, (errCode = e.code || e.errorCode))
      );
    } else if (
      e instanceof Prisma.PrismaClientUnknownRequestError ||
      e instanceof Prisma.PrismaClientRustPanicError ||
      e instanceof Prisma.PrismaClientValidationError
    ) {
      let msg = e.message.split("Argument");
      next(new PrismaError(e.name, msg[1], 406, 406));
    }
  }
};

const orderRejected = async (req, res) => {
  let orderId = parseInt(req.query.orderId);
  let reason = req.body.reason;
  const io = req.app.get("socketio");
  try {
    if (req.user.role != 2) throw new AppError("ليس لديك صلاحية", 401, 401);

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

    io.emit("rejectOrder", {
      message: "Order rejected num: " + order.id,
    });

    res.json(order);
  } catch (e) {
    if (e instanceof AppError) {
      next(new AppError("Validation Error", e.name, e.code, e.errorCode));
    } else if (
      e instanceof Prisma.PrismaClientKnownRequestError ||
      e instanceof Prisma.PrismaClientInitializationError
    ) {
      let msg = errorCode(`${e.code || e.errorCode}`);
      next(
        new PrismaError(e.name, msg, 400, (errCode = e.code || e.errorCode))
      );
    } else if (
      e instanceof Prisma.PrismaClientUnknownRequestError ||
      e instanceof Prisma.PrismaClientRustPanicError ||
      e instanceof Prisma.PrismaClientValidationError
    ) {
      let msg = e.message.split("Argument");
      next(new PrismaError(e.name, msg[1], 406, 406));
    }
  }
};

const processOrder = async (req, res, next) => {
  let orderId = parseInt(req.query.orderId);
  let newData = req.body;
  if (req.user.role != 3) throw new AppError("ليس لديك صلاحية", 401, 401);
  let updatedOrder;
  try {
    if (newData.orderStatus == 3) {
      updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          customerName: newData.customerName,
          customerPhone: newData.customerPhone,
          customerPhone2: newData.customerPhone2,
          customerLat: newData.customerLat,
          customerLong: newData.customerLong,
          city: newData.city,
          area: newData.area,
          nearestPoint: newData.nearestPoint,
          orderAmount: newData.orderAmount,
          orderCount: newData.orderCount,
          orderStatus: newData.orderStatus,
          notes: newData.notes,
          reason: newData.reason,
          merchantId: newData.merchantId,
          delegateId: newData.delegateId,
        },
      });
      const dele = await prisma.delegate.findUnique({
        where: { id: updatedOrder.delegateId },
      });
      if (dele.fcmToken)
        await sendNofi(
          "معالجة الطلب",
          `تم معالجة الطلب ${updatedOrder.id} بنجاح`,
          dele.fcmToken
        );
    } else if (newData.orderStatus == 7) {
      updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          customerName: newData.customerName,
          customerPhone: newData.customerPhone,
          customerPhone2: newData.customerPhone2,
          customerLat: newData.customerLat,
          customerLong: newData.customerLong,
          city: newData.city,
          area: newData.area,
          nearestPoint: newData.nearestPoint,
          orderAmount: newData.orderAmount,
          orderCount: newData.orderCount,
          orderStatus: newData.orderStatus,
          notes: newData.notes,
          reason: newData.reason,
          merchantId: newData.merchantId,
          delegateId: newData.delegateId,
        },
      });
      const mer = await prisma.merchant.findUnique({
        where: { id: updatedOrder.merchantId },
      });
      if (mer.fcmToken)
        await sendNofi(
          "معالجة الطلب",
          `تم معالجة الطلب ${updatedOrder.id} بنجاح`,
          mer.fcmToken
        );
    } else
      throw new AppError(
        "اختيار اما تبليغ صاحب البيج او تحويل للمندوب",
        401,
        401
      );

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
        delegate: {
          connect: {
            id: updatedOrder.delegateId,
          },
        },
      },
    });
    return res.status(200).json(updatedOrder);
  } catch (e) {
    if (e instanceof AppError) {
      next(new AppError("Validation Error", e.name, e.code, e.errorCode));
    } else if (
      e instanceof Prisma.PrismaClientKnownRequestError ||
      e instanceof Prisma.PrismaClientInitializationError
    ) {
      let msg = errorCode(`${e.code || e.errorCode}`);
      next(
        new PrismaError(e.name, msg, 400, (errCode = e.code || e.errorCode))
      );
    } else if (
      e instanceof Prisma.PrismaClientUnknownRequestError ||
      e instanceof Prisma.PrismaClientRustPanicError ||
      e instanceof Prisma.PrismaClientValidationError
    ) {
      let msg = e.message.split("Argument");
      next(new PrismaError(e.name, msg[1], 406, 406));
    }
  }
};
// const editOrderAdmin = async (req, res, next) => {
//   let orderId = parseInt(req.query.orderId);
//   let newData = req.body;
//   let updatedOrder;

//   try {
//     if (newData.orderStatus)
//       throw new AppError("ليس لديك صلاحية تعديل حالة الطلب", 406, 406);
//     if (req.user.role == 1 || req.user.role == 2)
//       throw new AppError("ليس لديك صلاحية", 401, 401);
//     if (!newData.orderStatus) {
//       updatedOrder = await prisma.order.update({
//         where: { id: orderId },
//         data: {
//           customerName: newData.customerName,
//           customerPhone: newData.customerPhone,
//           customerPhone2: newData.customerPhone2,
//           customerLat: newData.customerLat,
//           customerLong: newData.customerLong,
//           city: newData.city,
//           area: newData.area,
//           nearestPoint: newData.nearestPoint,
//           orderAmount: newData.orderAmount,
//           orderCount: newData.orderCount,
//           // orderStatus: newData.orderStatus,
//           notes: newData.notes,
//           reason: newData.reason,
//           // merchantId: newData.merchantId,
//           delegateId: newData.delegateId,
//         },
//       });
//     } else
//       throw new AppError(
//         "اختيار اما تبليغ صاحب البيج او تحويل للمندوب",
//         401,
//         401
//       );

//     const orderHis = await prisma.orderHistory.create({
//       data: {
//         orderId: updatedOrder.id,
//         customerName: updatedOrder.customerName,
//         customerPhone: updatedOrder.customerPhone,
//         customerPhone2: updatedOrder.customerPhone2,
//         customerLat: updatedOrder.customerLat,
//         customerLong: updatedOrder.customerLong,
//         city: updatedOrder.city,
//         area: updatedOrder.area,
//         nearestPoint: updatedOrder.nearestPoint,
//         orderAmount: updatedOrder.orderAmount,
//         orderCount: updatedOrder.orderCount,
//         orderStatus: updatedOrder.orderStatus,
//         notes: updatedOrder.notes,
//         reason,
//         merchant: {
//           connect: {
//             id: updatedOrder.merchantId,
//           },
//         },
//         delegate: {
//           connect: {
//             id: updatedOrder.delegateId,
//           },
//         },
//       },
//     });

//     return res.status(200).json(updatedOrder);
//   } catch (e) {
//     if (e instanceof AppError) {
//       next(new AppError("Validation Error", e.name, e.code, e.errorCode));
//     } else if (
//       e instanceof Prisma.PrismaClientKnownRequestError ||
//       e instanceof Prisma.PrismaClientInitializationError
//     ) {
//       let msg = errorCode(`${e.code || e.errorCode}`);
//       next(
//         new PrismaError(e.name, msg, 400, (errCode = e.code || e.errorCode))
//       );
//     } else if (
//       e instanceof Prisma.PrismaClientUnknownRequestError ||
//       e instanceof Prisma.PrismaClientRustPanicError ||
//       e instanceof Prisma.PrismaClientValidationError
//     ) {
//       let msg = e.message.split("Argument");
//       next(new PrismaError(e.name, msg[1], 406, 406));
//     }
//   }
// };

const orderReverted = async (req, res) => {
  let orderId = parseInt(req.query.orderId);
  try {
    if (req.user.role != 3) throw new AppError("ليس لديك صلاحية", 401, 401);

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
  } catch (e) {
    if (e instanceof AppError) {
      next(new AppError("Validation Error", e.name, e.code, e.errorCode));
    } else if (
      e instanceof Prisma.PrismaClientKnownRequestError ||
      e instanceof Prisma.PrismaClientInitializationError
    ) {
      let msg = errorCode(`${e.code || e.errorCode}`);
      next(
        new PrismaError(e.name, msg, 400, (errCode = e.code || e.errorCode))
      );
    } else if (
      e instanceof Prisma.PrismaClientUnknownRequestError ||
      e instanceof Prisma.PrismaClientRustPanicError ||
      e instanceof Prisma.PrismaClientValidationError
    ) {
      let msg = e.message.split("Argument");
      next(new PrismaError(e.name, msg[1], 406, 406));
    }
  }
};

const orderHistory = async (req, res) => {
  try {
    if (req.user.role == 1 || req.user.role == 2)
      throw new AppError("ليس لديك صلاحية", 401, 401);

    if (req.query.orderId == null)
      throw new AppError("يجب اختيار طلب", 406, 406);
    let orderId = parseInt(req.query.orderId);

    const orderHis = await prisma.orderHistory.findMany({
      where: {
        orderId,
      },
      select: {
        orderStatus: true,
        createAt: true,
      },
      orderBy: [
        {
          createAt: "desc",
        },
      ],
    });
    if (!orderHis) return res.json([]);
    return res.json(orderHis);
  } catch (e) {
    if (e instanceof AppError) {
      next(new AppError("Validation Error", e.name, e.code, e.errorCode));
    } else if (
      e instanceof Prisma.PrismaClientKnownRequestError ||
      e instanceof Prisma.PrismaClientInitializationError
    ) {
      let msg = errorCode(`${e.code || e.errorCode}`);
      next(
        new PrismaError(e.name, msg, 400, (errCode = e.code || e.errorCode))
      );
    } else if (
      e instanceof Prisma.PrismaClientUnknownRequestError ||
      e instanceof Prisma.PrismaClientRustPanicError ||
      e instanceof Prisma.PrismaClientValidationError
    ) {
      let msg = e.message.split("Argument");
      next(new PrismaError(e.name, msg[1], 406, 406));
    }
  }
};

const editOrderMer = async (req, res) => {
  try {
    if (req.user.role != 1) throw new AppError("ليس لديك صلاحية", 401, 401);

    if (!req.query.orderId) throw new AppError("يجب اختيار طلب", 406, 406);

    let orderId = parseInt(req.query.orderId);
    const {
      // customerName = "",
      customerPhone,
      customerPhone2,
      city,
      area,
      nearestPoint,
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
        city,
        area,
        nearestPoint,
        orderStatus: 3,
      },
    });
    const dele = await prisma.delegate.findUnique({
      where: { id: updatedOrder.delegateId },
    });
    if (dele.fcmToken)
      await sendNofi("عهدة المندوب", "تم معالجة الطلب", dele.fcmToken);
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
  } catch (e) {
    if (e instanceof AppError) {
      next(new AppError("Validation Error", e.name, e.code, e.errorCode));
    } else if (
      e instanceof Prisma.PrismaClientKnownRequestError ||
      e instanceof Prisma.PrismaClientInitializationError
    ) {
      let msg = errorCode(`${e.code || e.errorCode}`);
      next(
        new PrismaError(e.name, msg, 400, (errCode = e.code || e.errorCode))
      );
    } else if (
      e instanceof Prisma.PrismaClientUnknownRequestError ||
      e instanceof Prisma.PrismaClientRustPanicError ||
      e instanceof Prisma.PrismaClientValidationError
    ) {
      let msg = e.message.split("Argument");
      next(new PrismaError(e.name, msg[1], 406, 406));
    }
  }
};

const addReceiptNum = async (req, res, next) => {
  try {
    if (!req.query.orderId || !req.query.receiptNum)
      throw new AppError("يجب اختيار طلب ورقم طلب", 406, 406);

    let orderId = parseInt(req.query.orderId);
    let receiptNum = parseInt(req.query.receiptNum);

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        ReceiptNum: receiptNum,
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
        ReceiptNum: updatedOrder.receiptNum,
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

    return res.status(200).json("تم اضافة الوصل الى الطلب بنجاح");
  } catch (e) {
    if (e instanceof AppError) {
      next(new AppError("Validation Error", e.name, e.code, e.errorCode));
    } else if (
      e instanceof Prisma.PrismaClientKnownRequestError ||
      e instanceof Prisma.PrismaClientInitializationError
    ) {
      let msg = errorCode(`${e.code || e.errorCode}`);
      next(
        new PrismaError(e.name, msg, 400, (errCode = e.code || e.errorCode))
      );
    } else if (
      e instanceof Prisma.PrismaClientUnknownRequestError ||
      e instanceof Prisma.PrismaClientRustPanicError ||
      e instanceof Prisma.PrismaClientValidationError
    ) {
      // console.log(e);

      let msg = e.message.split("Argument");
      // || e.message.split("argument")[1].trim();
      // console.log("e.message: " + e.message);
      // console.log("msg: " + msg);

      next(new PrismaError(e.name, msg[1], 406, 406));
    }
  }
};

module.exports = {
  create,
  getOrder,
  OrdersBasedOnStatus,
  assignOrderDelegate,
  guaranteeOrderDelegate,
  orderDelivered,
  orderRejected,
  processOrder,
  orderReverted,
  orderHistory,
  editOrderMer,
  addReceiptNum,
  // editOrderAdmin,
};
