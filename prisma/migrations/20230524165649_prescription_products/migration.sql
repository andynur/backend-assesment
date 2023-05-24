-- CreateEnum
CREATE TYPE "PrescriptionStatusType" AS ENUM ('Created', 'Cancelled', 'Confirmed');

-- CreateTable
CREATE TABLE "UserLog" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "logType" TEXT NOT NULL,
    "logMessage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL,
    "priceConfig" SMALLINT NOT NULL,
    "includingTaxes" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prescription" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "patientName" TEXT NOT NULL,
    "clinicName" TEXT NOT NULL,
    "doctorName" TEXT NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "status" "PrescriptionStatusType" NOT NULL DEFAULT 'Created',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrescriptionDetail" (
    "id" SERIAL NOT NULL,
    "prescriptionID" INTEGER NOT NULL,
    "productID" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "originalPrice" INTEGER NOT NULL,
    "priceConfig" SMALLINT NOT NULL,
    "includingTaxes" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrescriptionDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "PrescriptionDetail_prescriptionID_productID_key" ON "PrescriptionDetail"("prescriptionID", "productID");

-- AddForeignKey
ALTER TABLE "UserLog" ADD CONSTRAINT "UserLog_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionDetail" ADD CONSTRAINT "PrescriptionDetail_productID_fkey" FOREIGN KEY ("productID") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionDetail" ADD CONSTRAINT "PrescriptionDetail_prescriptionID_fkey" FOREIGN KEY ("prescriptionID") REFERENCES "Prescription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
