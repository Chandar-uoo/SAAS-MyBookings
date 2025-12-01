import { razorPayInstance } from "../../config/rzpy";
import { IPaymentHandlers } from "../interfaces/IPaymentHandlers";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";

export class RzpyHelper implements IPaymentHandlers {
  
  async createOrder(meta: any, amount: number): Promise<{ orderId: string }> {
    console.log(meta);
    
    const order = await razorPayInstance.orders.create({
      amount,
      currency: "INR",
      notes: {
       meta: JSON.stringify(meta),
      },
    });
    console.log(order);
    
    return { orderId: order.id };
  }

  verifyWebhook(signature: string, rawBody: string): boolean {
    console.log(signature, "+", process.env.RAZORPAY_WEBHOOK_SECRET);

    //validate sign
    const isValidWebhookSignature = validateWebhookSignature(
      rawBody,
      signature,
      process.env.RAZORPAY_WEBHOOK_SECRET!
    );

    return isValidWebhookSignature;
  }
}
