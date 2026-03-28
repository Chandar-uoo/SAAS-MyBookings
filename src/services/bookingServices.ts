import { PrismaClient } from "@prisma/client";
import { BookingRepository } from "../repositories/bookingRepositary";
import { PaymentRepositary } from "../repositories/paymentRepositary";

export class BookingService {
  constructor(
    private bookingRepositary: BookingRepository,
    private paymentReposiatary: PaymentRepositary,
    private prisma :PrismaClient
  ) {}
  async handleBookingPayment(ctx: {
    schemaName: string;
    status: string;
    bookingId: string;
    paymentId: string;
  }) {
    return this.prisma.$transaction(async (tx) => {
      await this.bookingRepositary.finalisingBookingOrder(tx, ctx);
      await this.paymentReposiatary.processUpdation(tx, ctx.paymentId);
      return;
    });
  }
}
