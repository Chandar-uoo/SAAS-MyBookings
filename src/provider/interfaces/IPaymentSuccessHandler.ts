export interface PaymentSuccessHandler {
  handle(paymentIntent: any, paymentId: string): Promise<void>;
}
