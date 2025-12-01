import { UserServiceEntity } from "../types/userServiceEntity";
import PrismaSingleton from "../config/prisma.singleton";

const prisma = PrismaSingleton.getInstance();
export class ServiceRepositary {
  private sanitizeSchema(schema: string): string {
    if (!/^[a-zA-Z0-9_]+$/.test(schema)) {
      throw new Error("Invalid schema name");
    }
    return schema;
  }

  async readAllService(schemaName: string): Promise<UserServiceEntity[]> {
    schemaName = this.sanitizeSchema(schemaName);

    const query = `SELECT * FROM "${schemaName}".services WHERE is_active = true`;
     return prisma.$queryRawUnsafe<UserServiceEntity[]>(query);
  }

async getServiceById(
  schemaName: string,
  id: string
): Promise<UserServiceEntity > {
  schemaName = this.sanitizeSchema(schemaName);

  const rows = await prisma.$queryRawUnsafe<UserServiceEntity[]>(
    `SELECT * FROM "${schemaName}".services WHERE id = $1::uuid LIMIT 1`,
    id
  );

  return rows[0] ?? null;
}

}
