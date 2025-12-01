import { AppError } from "../utils/errors";
import { Prisma } from "@prisma/client";
import { IBookingEngine } from "../provider/interfaces/IBookingEngine";
import { ServiceEntity } from "../types/serviceEntity";
import { BookingRepository } from "../repositories/bookingRepositary";

export class AppointmentEngine implements IBookingEngine {
  constructor(
    private repo: BookingRepository,
    private service: ServiceEntity,
    private ctx: {
      schema: string;
      start: Date;
      end: Date;
      userId: string;
      status: string;
    }
  ) {}

  async validate(tx: Prisma.TransactionClient): Promise<void> {
    const taken = await this.repo.isAppointmentSlotTaken(
      this.ctx.schema,
      this.service.id,
      tx,
      this.ctx.start,
      this.ctx.end
    );

    if (taken) throw new AppError("slot taken", 400);
  }

  getMeta() {
    return {}; // appointment does not need extra metadata
  }
}
