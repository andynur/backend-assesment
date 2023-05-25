/*
  Warnings:

  - You are about to drop the `Finance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Finance" DROP CONSTRAINT "Finance_userID_fkey";

-- DropForeignKey
ALTER TABLE "UserLog" DROP CONSTRAINT "UserLog_userID_fkey";

-- DropTable
DROP TABLE "Finance";

-- DropTable
DROP TABLE "UserLog";

-- DropEnum
DROP TYPE "FinanceType";
