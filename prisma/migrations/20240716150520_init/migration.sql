-- CreateTable
CREATE TABLE "Merchant" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fullname" VARCHAR(300) NOT NULL,
    "username" VARCHAR(20) NOT NULL,
    "phone" TEXT NOT NULL,
    "pageName" TEXT NOT NULL,
    "lat" TEXT NOT NULL,
    "long" TEXT NOT NULL,
    "debt" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Merchant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Delegate" (
    "id" SERIAL NOT NULL,
    "name" TEXT,

    CONSTRAINT "Delegate_pkey" PRIMARY KEY ("id")
);
