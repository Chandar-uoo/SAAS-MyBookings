import { connect } from "http2";
import PrismaSingleton from "../config/prisma.singleton";
import { Prisma } from "@prisma/client";
const prisma = PrismaSingleton.getInstance();

export class TenantRepositary {
  async createPendingTenant(data: Prisma.TenantCreateInput) {
    return prisma.tenant.create({ data });
  }

  async findBySlug(slug: string) {
    return prisma.tenant.findUnique({
      where: { slug },
      select: {
        id: true,
        businessName: true,
        slug: true,
        category: true,
        resourceType: true,
        openTime: true,
        closeTime: true,
        daysAvailable: true,
        paymentRequired: true,
        paymentType: true,
      },
    });
  }


}
