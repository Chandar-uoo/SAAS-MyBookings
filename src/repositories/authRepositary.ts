import PrismaSingleton from "../config/prisma.singleton";
import { BaseRepositary } from "./baseRepositary";

const prisma = PrismaSingleton.getInstance();
export class AuthRepositary extends BaseRepositary {
 

  async registerUser(
    schemaName: string,
    data: { name: string; email: string; phone: string; password: string }
  ): Promise<any> {
    schemaName = this.sanitizeSchema(schemaName);
    const query = `INSERT INTO "${schemaName}".users ("name", email, phone,password)
VALUES ($1, $2, $3,$4)
RETURNING *;
`;
    const params = [data.name, data.email, data.phone, data.password];

    const result = await prisma.$queryRawUnsafe<any>(query, ...params);

    return result[0];
  }
  async findUserExist(schemaName: string, email: string): Promise<any> {
    schemaName = this.sanitizeSchema(schemaName);

    const query = `select * from "${schemaName}".users where email = $1`;
    const result = await prisma.$queryRawUnsafe<any>(query,email);
    return result[0];
  }
  async findUserById(schemaName: string, id: string): Promise<any> {
    schemaName = this.sanitizeSchema(schemaName);

    const query = `select * from "${schemaName}".users where id = $1::uuid`;
    const result = await prisma.$queryRawUnsafe<any>(query, id);
    return result[0];
  }
  
}
