import PrismaSingleton from "../config/prisma.singleton";
import { eventBus } from "../event/eventBus";
import { IPaymentHandlers } from "../provider/interfaces/IPaymentHandlers";
import { PaymentRepositary } from "../repositories/paymentRepositary";
import { InvalidRazorpaySignature } from "../utils/errors";
const prisma = PrismaSingleton.getInstance();
export class PaymentService {
  constructor(
    private paymentRepositary: PaymentRepositary,
    private paymentHandlers: IPaymentHandlers
  ) {}

  async processWebhook(signature: string, rawBody: string) {
    // 1. verify  signature
    const isValid: boolean = this.paymentHandlers.verifyWebhook(
      signature,
      rawBody
    );
    if (!isValid)
      throw new InvalidRazorpaySignature("Invalid Razorpay signature");

    // 2. convert to objects
    const payload = JSON.parse(rawBody);

    // 3. Extract payment entity only
    const payment = payload.payload.payment.entity;

    // Extract required fields
    const paymentIntent = JSON.parse(payment.notes.meta);
    const razorpayOrderId = payment.order_id;
    const amount = payment.amount;
    const currency = payment.currency;

    // Start transaction
    const savedPayment = await prisma.$transaction(async (tx) => {
      // Idempotency check
      const isOrderExist = await this.paymentRepositary.findByOrderId(
        tx,
        razorpayOrderId
      );
      if (isOrderExist) return isOrderExist;

      // Prepare payment data
      const paymentData = {
        razorpayOrderId,
        razorpayPaymentId: payment.id,
        amount,
        currency,
        status: "SUCCESS",
        rawPayload: payload,
        meta: paymentIntent,
      };

      // 4.3. Save to DB
      return await this.paymentRepositary.createPayment(tx, paymentData);
    });
    // transaction ends

    // 5.emit event
    eventBus.emit("payment.success", {
      paymentIntent,
      paymentId: savedPayment.id,
    });
    console.log("all clear from payment service side");

    return;
  }
}
