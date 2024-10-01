/*
  Warnings:

  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `receiptNum` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `receiptNum` on the `OrderHistory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderIdPK` to the `OrderHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Order_receiptNum_key";

-- AlterTable
ALTER TABLE "Order" DROP CONSTRAINT "Order_pkey",
DROP COLUMN "receiptNum",
ADD COLUMN     "idPK" SERIAL NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ADD CONSTRAINT "Order_pkey" PRIMARY KEY ("idPK");
DROP SEQUENCE "Order_id_seq";

-- AlterTable
ALTER TABLE "OrderHistory" DROP COLUMN "receiptNum",
ADD COLUMN     "orderIdPK" INTEGER NOT NULL,
ALTER COLUMN "orderId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_id_key" ON "Order"("id");
