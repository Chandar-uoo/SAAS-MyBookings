import { eventBus } from "./eventBus";
import { ProvisionerService } from "../services/provisionerService";
import { ProvisionerRepository } from "../repositories/provisionerRepository";
import { PaymentSuccessHandlerFactory } from "../factory/paymentSuccessHandlersFactory";
import { BookingRepository } from "../repositories/bookingRepositary";
import { BookingService } from "../services/bookingServices";
import { PaymentRepositary } from "../repositories/paymentRepositary";
const paymentRepositary = new PaymentRepositary();
const provisionerRepository = new ProvisionerRepository();
const provisionerService = new ProvisionerService(provisionerRepository,paymentRepositary);
const bookingRepositary = new BookingRepository();
const bookingService = new BookingService(bookingRepositary, paymentRepositary);
eventBus.on("payment.success", async ({ paymentIntent, paymentId }) => {
  try {
    const { type } = paymentIntent;
    const deps = { provisionerService, bookingService };
    const handler = PaymentSuccessHandlerFactory.create(type, deps);
    await handler.handle(paymentIntent, paymentId);
  } catch (error) {
    console.log(error);
  }
});
