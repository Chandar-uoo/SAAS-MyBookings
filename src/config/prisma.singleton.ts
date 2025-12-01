import { PrismaClient } from "@prisma/client";

class PrismaSingleton {
  private static instance: PrismaClient;
  private constructor() {}
  static getInstance(): PrismaClient {
    if (!PrismaSingleton.instance) {
      PrismaSingleton.instance = new PrismaClient();
      console.log("🔹 Prisma instance ready for queries");
    }
    return PrismaSingleton.instance;
  }
}
export default PrismaSingleton;
