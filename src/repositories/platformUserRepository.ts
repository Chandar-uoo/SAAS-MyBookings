import PrismaSingleton from "../config/prisma.singleton";
import { User } from "@prisma/client";

const prisma = PrismaSingleton.getInstance();

export class PlatformUserRepository {
  async create(data: { name: string; email: string; password: string }):Promise<User> {
    return prisma.user.create({ data });
  }

  async findEmailExists(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }
async findUserById(userId :string){
  
  return prisma.user.findUnique({
    where:{id:userId}
  })
}
}
