import { CreateTenantDTO } from "../dto/tenant";
import { TenantRepositary } from "../repositories/tenantRepositary";
import { AppError } from "../utils/errors";
import { IPaymentHandlers } from "../provider/interfaces/IPaymentHandlers";
import { Prisma } from "@prisma/client";

export class TenantService {
  constructor(
    private tenantRepository: TenantRepositary,
    private paymentHandlers: IPaymentHandlers
  ) {}
  // create tenant
  async createTenantService(userId: string, data: CreateTenantDTO) {
    //1. owner exist
    const ownerExist = await this.tenantRepository.findByOwnerId(userId);

    if (ownerExist) throw new AppError("You already created a business",409);

    // 2 . slug check
    const slugExists = await this.tenantRepository.findBySlug(data.slug);

    if (slugExists) throw new AppError("Business slug already exists.",409);

    // 4. timing chech
    const open = new Date(`1970-01-01T${data.openTime}:00`);
    const close = new Date(`1970-01-01T${data.closeTime}:00`);

    if (open > close) {
      throw new AppError("Opening time cannot be after closing time", 400);
    }

    const createInput: Prisma.TenantCreateInput = {
      businessName: data.businessName,
      slug: data.slug,
      category: data.category,
      address: data.address,
      city: data.city,
      country: data.country,
      resourceType: data.resourceType,
      openTime: open,
      closeTime: close,
      daysAvailable: data.daysAvailable,
      paymentRequired: data.paymentRequired,
      paymentType: data.paymentType ?? null,
      currency: data.currency ?? null,

      owner: {
        connect: { id: userId },
      },
    };
    // 5. Proceed with creating tenant (pending)
    const tenant = await this.tenantRepository.createPendingTenant(createInput);
    // 5.1
    const meta = {
      type: "TENANT_REGISTRATION",
      tenantId: tenant.id,
    };
    // 6 . payment initilze

    const { orderId } = await this.paymentHandlers.createOrder(meta, 50000);

    return { orderId };
  }
}
