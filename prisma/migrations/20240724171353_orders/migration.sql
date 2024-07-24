/*
  Warnings:

  - Made the column `customerPhone2` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "nearestPoint" TEXT,
ALTER COLUMN "customerPhone2" SET NOT NULL;
