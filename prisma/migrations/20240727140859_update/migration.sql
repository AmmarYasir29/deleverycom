/*
  Warnings:

  - Added the required column `type` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "type" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Merchant" ADD COLUMN     "moneyReq" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "debt" SET DEFAULT 0;
