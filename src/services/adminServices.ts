import { CreateServiceDTO, UpdateServiceDTO } from "../dto/adminDto";
import { ResourceValidatorFactory } from "../factory/resourceValidatorFactory";
import { AdminRepository } from "../repositories/adminRepositary";
import { ServiceEntity } from "../types/serviceEntity";
import { TenantBusinessInfo } from "../types/tenant";
import { AppError } from "../utils/errors";

export class AdminServices {
  constructor(private adminRepositary: AdminRepository) {}

  async createService(tenant: TenantBusinessInfo, data: CreateServiceDTO) {
    const schemaName = `tenant_${tenant.slug}`;

    const existingService = await this.adminRepositary.getServiceByName(
      schemaName,
      data.name
    );

    if (existingService) throw new AppError("ConflictError", 409);

    // 3 CHOOSE RESOURCE
    const resourceTypeEngine = ResourceValidatorFactory.resource(
      tenant.resourceType
    );
    // 4 validate the resource
    resourceTypeEngine.validate(data);
    // 4. If tenant requires payment → price is mandatory
    if (
      tenant.paymentRequired &&
      (data.price === undefined || data.price === null)
    ) {
      throw new AppError("Price is required for paid tenants", 400);
    }

    // 5. Save to tenant schema
    const created = await this.adminRepositary.createService(schemaName, data);
    return { created };
  }

  async readServices(tenant: TenantBusinessInfo) {
    const schemaName = `tenant_${tenant.slug}`;

    const services = await this.adminRepositary.getAllServices(schemaName);
    return { services };
  }

  async updateService(
    tenant: TenantBusinessInfo,
    data: UpdateServiceDTO,
    service: ServiceEntity
  ) {
    const schemaName = `tenant_${tenant.slug}`;

    const isServicePresent = await this.adminRepositary.getServiceById(
      schemaName,
      service.id
    );
    if (!isServicePresent) throw new AppError("SERVICE_NOT_EXIST", 404);

    // merge it
    const updated = { ...isServicePresent, ...data };

    const resourceTypeEngine = ResourceValidatorFactory.resource(
      tenant.resourceType
    );
    // 4 validate the resource
    resourceTypeEngine.validate(data);

    const updates = await this.adminRepositary.updateService(
      schemaName,
      service.id,
      data
    );
    return { updates };
  }

  async deleteService(tenant: TenantBusinessInfo, service: ServiceEntity) {
    const schemaName = `tenant_${tenant.slug}`;

    const isServicePresent = await this.adminRepositary.getServiceById(
      schemaName,
      service.id
    );
    if (!isServicePresent) throw new AppError("SERVICE_NOT_EXIST", 404);

    // mark as delete

    const markAsdeleteService = this.adminRepositary.deleteServiceById(
      schemaName,
      service.id
    );

    return { markAsdeleteService };
  }
}
