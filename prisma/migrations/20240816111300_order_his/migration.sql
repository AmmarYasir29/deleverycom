-- CreateTable
CREATE TABLE "OrderHistory" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT,
    "customerPhone2" TEXT,
    "customerLat" TEXT,
    "customerLong" TEXT,
    "city" TEXT,
    "area" TEXT,
    "nearestPoint" TEXT,
    "orderAmount" DOUBLE PRECISION NOT NULL,
    "orderCount" INTEGER,
    "orderStatus" INTEGER NOT NULL,
    "notes" TEXT,
    "reason" TEXT,
    "merchantId" INTEGER NOT NULL,
    "delegateId" INTEGER,

    CONSTRAINT "OrderHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderHistory" ADD CONSTRAINT "OrderHistory_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderHistory" ADD CONSTRAINT "OrderHistory_delegateId_fkey" FOREIGN KEY ("delegateId") REFERENCES "Delegate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
