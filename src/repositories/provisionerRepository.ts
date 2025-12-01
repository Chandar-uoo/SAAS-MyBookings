import { Prisma } from "@prisma/client";
import PrismaSingleton from "../config/prisma.singleton";

const prisma = PrismaSingleton.getInstance();

export class ProvisionerRepository {
  async findTenantById(id: string) {
    return prisma.tenant.findUnique({ where: { id } });
  }

  async finalizeProvisioning(
    client: Prisma.TransactionClient,
    tenantId: string,
    url: any
  ) {
    await client.tenant.update({
      where: { id: tenantId },
      data: {
        subscriptionStatus: "ACTIVE",
        bookingURL: url.bookingURL, // created earlier
        dashboardURL: url.dashboardURL, // created earlier
      },
    });
  }

  // CREATE SCHEMA
  async createTenantSchema(slug: string) {
    const schemaName = `tenant_${slug.replace(/[^a-zA-Z0-9_]/g, "")}`;

    await prisma.$executeRawUnsafe(`
      CREATE SCHEMA IF NOT EXISTS "${schemaName}";
    `);

    return schemaName; // return for next steps
  }
  // CREATE TABLES
  async createTables(schemaName: string) {
    // 1. USERS (must come first)
    await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "${schemaName}".users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'USER',
      created_at TIMESTAMP DEFAULT now()
    );
  `);

    // 2. SERVICES (second)
    await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "${schemaName}".services (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      description TEXT,
      duration_minutes INTEGER,
      capacity INTEGER,
      price NUMERIC,
      meta JSONB,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT now()
    );
  `);

    // 3. BOOKINGS (third, now FK references can work)
    await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "${schemaName}".bookings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES "${schemaName}".users(id),
      service_id UUID NOT NULL REFERENCES "${schemaName}".services(id),
      start_ts TIMESTAMP,
      end_ts TIMESTAMP,
      status TEXT DEFAULT 'PENDING',
      payment_id TEXT,
      meta JSONB,
      created_at TIMESTAMP DEFAULT now()
    );
  `);
  }
}
