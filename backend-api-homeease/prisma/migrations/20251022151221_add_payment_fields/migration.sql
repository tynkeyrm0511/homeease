/*
  Warnings:

  - A unique constraint covering the columns `[paymentSessionId]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "paymentSessionId" TEXT,
ADD COLUMN     "paymentStatus" TEXT DEFAULT 'pending',
ADD COLUMN     "paymentTransactionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_paymentSessionId_key" ON "Invoice"("paymentSessionId");
