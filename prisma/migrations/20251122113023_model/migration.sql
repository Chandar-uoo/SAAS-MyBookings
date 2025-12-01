/*
  Warnings:

  - The values [APPOINTMENT,SESSION,ROOM,TABLE,EQUIPMENT] on the enum `ResourceType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `avgDuration` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `pricePerUnit` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `timeUnit` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `totalResources` on the `Tenant` table. All the data in the column will be lost.
  - Added the required column `openTime` to the `Tenant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `closeTime` to the `Tenant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ResourceType_new" AS ENUM ('APPOINTMENT_ENGINE', 'TIME_RANGE_ENGINE');
ALTER TABLE "Tenant" ALTER COLUMN "resourceType" TYPE "ResourceType_new" USING ("resourceType"::text::"ResourceType_new");
ALTER TYPE "ResourceType" RENAME TO "ResourceType_old";
ALTER TYPE "ResourceType_new" RENAME TO "ResourceType";
DROP TYPE "public"."ResourceType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "avgDuration",
DROP COLUMN "pricePerUnit",
DROP COLUMN "timeUnit",
DROP COLUMN "totalResources",
DROP COLUMN "openTime",
ADD COLUMN     "openTime" TIME NOT NULL,
DROP COLUMN "closeTime",
ADD COLUMN     "closeTime" TIME NOT NULL;

-- AddForeignKey
ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
