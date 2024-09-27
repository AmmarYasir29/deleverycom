/*
  Warnings:

  - A unique constraint covering the columns `[ReceiptNum]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "ReceiptNum" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Order_ReceiptNum_key" ON "Order"("ReceiptNum");
