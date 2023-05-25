/*
  Warnings:

  - Added the required column `finalPrice` to the `PrescriptionDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Prescription" ALTER COLUMN "totalPrice" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "PrescriptionDetail" ADD COLUMN     "finalPrice" INTEGER NOT NULL;
