import { PaymentSuccessHandler } from "../provider/interfaces/IPaymentSuccessHandler";
import { BookingService } from "../services/bookingServices";

export class BookingPaymentHandler implements PaymentSuccessHandler {
  constructor(private bookingService: BookingService) {}
  async handle(paymentIntent: any, paymentId: string): Promise<void> {
    const { schemaName, bookingId } = paymentIntent;
    const ctx = {
      schemaName,
      status: "CONFIRMED",
      bookingId,
      paymentId,
    };
    await this.bookingService.handleBookingPayment(ctx);
  }
}
