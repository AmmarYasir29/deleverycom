-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_delegateId_fkey";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "delegateId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_delegateId_fkey" FOREIGN KEY ("delegateId") REFERENCES "Delegate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
