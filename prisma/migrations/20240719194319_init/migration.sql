/*
  Warnings:

  - You are about to alter the column `fullname` on the `Delegate` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(300)`.

*/
-- AlterTable
ALTER TABLE "Delegate" ALTER COLUMN "fullname" SET DATA TYPE VARCHAR(300);
