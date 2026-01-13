import PrismaSingleton from "../config/prisma.singleton";
import { CreateServiceDTO, UpdateServiceDTO } from "../dto/adminDto";
import { ServiceEntity } from "../types/serviceEntity";
import { BaseRepositary } from "./baseRepositary";

const prisma = PrismaSingleton.getInstance();

export class AdminRepository extends BaseRepositary {
 

  // RETURN TYPE: ServiceEntity
  async createService(
    schemaName: string,
    data: CreateServiceDTO
  ): Promise<ServiceEntity> {
    schemaName = this.sanitizeSchema(schemaName);

    const query = `
      INSERT INTO "${schemaName}".services
      (name, description, duration_minutes, capacity, price, meta)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const params = [
      data.name,
      data.description || null,
      data.duration_minutes || null,
      data.capacity || null,
      data.price || null,
      data.meta ? data.meta : null,
    ];

    const result = await prisma.$queryRawUnsafe<ServiceEntity[]>(
      query,
      ...params
    );

    return result[0];
  }

  async getAllServices(schemaName: string): Promise<ServiceEntity[]> {
    schemaName = this.sanitizeSchema(schemaName);

    return prisma.$queryRawUnsafe<ServiceEntity[]>(
      `SELECT * FROM "${schemaName}".services ORDER BY created_at DESC;`
    );
  }

  async getServiceById(
    schemaName: string,
    id: string
  ): Promise<ServiceEntity | null> {
    schemaName = this.sanitizeSchema(schemaName);

    const result = await prisma.$queryRawUnsafe<ServiceEntity[]>(
      `SELECT * FROM "${schemaName}".services WHERE id = $1::uuid LIMIT 1`,
      id
    );

    return result[0] || null;
  }

  async getServiceByName(
    schemaName: string,
    name: string
  ): Promise<ServiceEntity | null> {
    schemaName = this.sanitizeSchema(schemaName);

    const result = await prisma.$queryRawUnsafe<ServiceEntity[]>(
      `SELECT * FROM "${schemaName}".services WHERE name = $1 LIMIT 1`,
      name
    );

    return result[0] || null;
  }

  async updateService(
    schemaName: string,
    serviceId: string,
    data: any
  ): Promise<ServiceEntity | null> {
    schemaName = this.sanitizeSchema(schemaName);

    // Build dynamic SET clause
    const keys = Object.keys(data);
    if (keys.length === 0) return null;

    const setClause = keys.map((key, i) => `"${key}" = $${i + 1}`).join(", ");

    const params = [...Object.values(data), serviceId];

    const query = `
    UPDATE "${schemaName}".services
    SET ${setClause}
    WHERE id = $${keys.length + 1}::uuid
    RETURNING *;
  `;

    const rows = await prisma.$queryRawUnsafe<ServiceEntity[]>(
      query,
      ...params
    );
    return rows[0] || null;
  }

  async deleteServiceById(
    schemaName: string,
    serviceId: string
  ): Promise<ServiceEntity | null> {
    schemaName = this.sanitizeSchema(schemaName);

    const query = `UPDATE "${schemaName}".services SET is_active = false WHERE id  = $1::uuid RETURNING *`;

    const rows = await prisma.$queryRawUnsafe<ServiceEntity[]>(
      query,
      serviceId
    );
    return rows[0] || null;
  }
}
