import PrismaSingleton from "../config/prisma.singleton";
import { PaymentRepositary } from "../repositories/paymentRepositary";
import { ProvisionerRepository } from "../repositories/provisionerRepository";
const prisma = PrismaSingleton.getInstance();
export class ProvisionerService {
  constructor(
    private provisionerRepository: ProvisionerRepository,
    private paymentReposiatary: PaymentRepositary
  ) {}

  async provisionTenant(tenantId: string, paymentId: string) {
    // Step 1: get tenant config
    const tenant = await this.provisionerRepository.findTenantById(tenantId);

    if (!tenant) {
      throw new Error(`Tenant not found with id: ${tenantId}`);
    }

    // Since slug is required in your model, no fallback needed
    const slug = tenant.slug;

    // url
    const url = {
      bookingURL: `http://localhost:3000/api/tenant/${slug}`,
      dashboardURL: `http://localhost:3000/api/admin/${slug}`,
    };

    // Step 2: create schema & DDL (not inside txn)
    await this.provisionerRepository.createTenantSchema(slug);
    await this.provisionerRepository.createTables(`tenant_${slug}`);

    // Step 3: transactional DB updates
    return prisma.$transaction(async (tx) => {
      await this.provisionerRepository.finalizeProvisioning(tx, tenantId, url);
      await this.paymentReposiatary.processUpdation(tx, paymentId);
    });
  }
}
