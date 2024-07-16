const express = require("express");
const app = express();
const port = 3000;
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
app.use(express.json());

app.get("/", async (req, res) => {
  await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice2@prisma.io",
      posts: {
        create: { title: "Hello World" },
      },
      profile: {
        create: { bio: "I like turtles" },
      },
    },
  });

  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
      profile: true,
    },
  });
  res.send(allUsers);
});

app.post(`/createMerchant`, async (req, res) => {
  const { fullname, username, phone, pageName, lat, long, debt } = req.body;
  const newMerchant = await prisma.Merchant.create({
    data: { fullname, username, phone, pageName, lat, long, debt },
  });
  res.json(newMerchant);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
