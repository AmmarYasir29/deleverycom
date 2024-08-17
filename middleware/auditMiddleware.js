const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const requestIp = require("request-ip");

const auditMiddleware = async (req, res, next) => {
  const startTime = Date.now();

  // Capture the initial request details and save the log entry
  const logEntry = await prisma.apiAuditLog.create({
    data: {
      method: req.method,
      urlPath: req.originalUrl,
      headers: req.headers,
      queryParams: req.query,
      requestBody: req.body,
      ipAddress:
        `${req.headers["-fox-forwardedr"]}` || `${req.socket.remoteAddress}`,
    },
  });
  console.log(req.socket.remoteAddress);
  console.log(req.ipAddress);
  console.log(requestIp.getClientIp(req));
  console.log(req.headers["x-forwarded-for"]);

  // Keep a reference to the original res.send method
  const originalSend = res.send;

  // Override res.send to capture the response details before sending it
  res.send = async function (data) {
    const responseTime = Date.now() - startTime;

    try {
      // Update the log entry with response details
      await prisma.apiAuditLog.update({
        where: { id: logEntry.id },
        data: {
          responseStatus: res.statusCode,
          responseBody: data,
          responseTime: responseTime,
        },
      });
    } catch (err) {
      console.error("Error updating audit log with response:", err);
    }

    // Call the original res.send method to actually send the response
    originalSend.apply(res, arguments);
  };

  next();
};

module.exports = auditMiddleware;
