import PrismaSingleton from "../config/prisma.singleton";
import { BookingRepository } from "../repositories/bookingRepositary";
import { PaymentRepositary } from "../repositories/paymentRepositary";
const prisma = PrismaSingleton.getInstance();

export class BookingService {
  constructor(
    private bookingRepositary: BookingRepository,
    private paymentReposiatary: PaymentRepositary
  ) {}
  async handleBookingPayment(ctx: {
    schemaName: string;
    status: string;
    bookingId: string;
    paymentId: string;
  }) {
    return prisma.$transaction(async (tx) => {
      await this.bookingRepositary.finalisingBookingOrder(tx, ctx);
      await this.paymentReposiatary.processUpdation(tx, ctx.paymentId);
      return;
    });
  }
}
