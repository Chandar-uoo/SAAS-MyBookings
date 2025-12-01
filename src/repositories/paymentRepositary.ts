import { Prisma } from "@prisma/client";

export class PaymentRepositary {
  createPayment(client: Prisma.TransactionClient, data: any) {
    return client.payment.create({ data });
  }
  findByOrderId(client: Prisma.TransactionClient, orderId: string) {
    return client.payment.findUnique({
      where: { razorpayOrderId: orderId },
    });
  }
  processUpdation(client: Prisma.TransactionClient, paymentId: string) {
   return client.payment.update({
      where: { id: paymentId },
      data: { processed: true, finalStatus: "SUCCESS" },
    });
  }
}
