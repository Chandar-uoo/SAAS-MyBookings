import { Prisma } from "@prisma/client";

export interface IBookingEngine {
  validate(tx: Prisma.TransactionClient): Promise<void>;
  getMeta(): any;
}
