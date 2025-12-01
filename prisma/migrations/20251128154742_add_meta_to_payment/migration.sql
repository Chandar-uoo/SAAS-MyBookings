/*
  Warnings:

  - You are about to drop the column `tenantId` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `meta` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_tenantId_fkey";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "tenantId",
ADD COLUMN     "meta" JSONB NOT NULL;
