import { Prisma } from "@prisma/client";
import { AppError } from "../utils/errors";
import { IBookingEngine } from "../provider/interfaces/IBookingEngine";

export class TimeRangeEngine implements IBookingEngine {
  constructor(
    private repo: any,
    private service: any,
    private ctx: {
      schema: string;
      start: Date;
      end: Date;
      qty: number;
      hasCapacity: boolean;
    }
  ) {}

  async validate(tx: Prisma.TransactionClient): Promise<void> {
    // Case 1 — single capacity
    if (!this.ctx.hasCapacity) {
      const conflict = await this.repo.countOverLapping(
        this.ctx.schema,
        this.service.id,
        this.ctx.start,
        this.ctx.end,
        tx
      );

      if (conflict > 0) throw new AppError("resource taken already", 400);
      return;
    }

    // Case 2 — multi capacity
    const used = await this.repo.sumOverlappingQuantities(
      this.ctx.schema,
      this.service.id,
      this.ctx.start,
      this.ctx.end,
      tx
    );

    const available = this.service.capacity! - used;

    if (available < this.ctx.qty)
      throw new AppError("resource taken already", 400);
  }

  getMeta() {
    return { quantity: this.ctx.qty };
  }
}
