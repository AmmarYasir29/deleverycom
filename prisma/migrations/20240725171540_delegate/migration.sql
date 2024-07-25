/*
  Warnings:

  - Added the required column `area` to the `Delegate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Delegate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Delegate" ADD COLUMN     "area" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Merchant" ADD COLUMN     "area" TEXT;
