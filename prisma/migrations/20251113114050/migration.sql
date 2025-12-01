-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('APPOINTMENT', 'SESSION', 'ROOM', 'TABLE', 'EQUIPMENT');

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "resourceType" "ResourceType" NOT NULL,
    "totalResources" INTEGER,
    "avgDuration" INTEGER,
    "openTime" TEXT,
    "closeTime" TEXT,
    "timeUnit" TEXT,
    "daysAvailable" TEXT[],
    "paymentRequired" BOOLEAN NOT NULL DEFAULT false,
    "paymentType" TEXT,
    "pricePerUnit" DECIMAL(10,2),
    "currency" TEXT DEFAULT 'INR',
    "bookingURL" TEXT NOT NULL,
    "dashboardURL" TEXT NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'free',
    "subscriptionStatus" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_slug_key" ON "Tenant"("slug");
