const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log("Prisma Client successfully connected to the database!");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
