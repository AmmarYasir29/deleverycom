/*
  Warnings:

  - You are about to drop the column `name` on the `Delegate` table. All the data in the column will be lost.
  - Added the required column `fullname` to the `Delegate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Delegate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Delegate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Delegate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `area` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerLat` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerLong` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerPhone` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `delegateId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `merchantId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notes` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderAmount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderCount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderStatus` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderType` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reason` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Delegate" DROP COLUMN "name",
ADD COLUMN     "fullname" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "username" VARCHAR(20) NOT NULL;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "area" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "customerLat" TEXT NOT NULL,
ADD COLUMN     "customerLong" TEXT NOT NULL,
ADD COLUMN     "customerName" TEXT NOT NULL,
ADD COLUMN     "customerPhone" TEXT NOT NULL,
ADD COLUMN     "delegateId" INTEGER NOT NULL,
ADD COLUMN     "merchantId" INTEGER NOT NULL,
ADD COLUMN     "notes" TEXT NOT NULL,
ADD COLUMN     "orderAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "orderCount" INTEGER NOT NULL,
ADD COLUMN     "orderStatus" INTEGER NOT NULL,
ADD COLUMN     "orderType" INTEGER NOT NULL,
ADD COLUMN     "reason" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_delegateId_fkey" FOREIGN KEY ("delegateId") REFERENCES "Delegate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
