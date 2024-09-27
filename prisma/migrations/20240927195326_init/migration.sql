/*
  Warnings:

  - You are about to drop the column `ReceiptNum` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[receiptNum]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `receiptNum` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Order_ReceiptNum_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "ReceiptNum",
ADD COLUMN     "receiptNum" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "OrderHistory" ADD COLUMN     "receiptNum" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Order_receiptNum_key" ON "Order"("receiptNum");
