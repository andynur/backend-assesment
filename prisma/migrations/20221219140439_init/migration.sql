-- CreateEnum
CREATE TYPE "FinanceType" AS ENUM ('income', 'expense');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Finance" (
    "id" SERIAL NOT NULL,
    "type" "FinanceType" NOT NULL,
    "description" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userID" INTEGER NOT NULL,

    CONSTRAINT "Finance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Finance" ADD CONSTRAINT "Finance_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
