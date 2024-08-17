const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    const result = await prisma.$queryRaw`SELECT current_database();`;
    console.log("Connected to database:", result[0].current_database);
    console.log("Prisma Client successfully connected to the database!");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
