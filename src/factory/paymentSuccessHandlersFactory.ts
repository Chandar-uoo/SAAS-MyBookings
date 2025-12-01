import { PaymentSuccessHandler } from "../provider/interfaces/IPaymentSuccessHandler";
import { BookingPaymentHandler } from "../stratigies/bookingPaymentHandler";
import { TenantRegistrationHandler } from "../stratigies/tenantRegistrationHandler";

export class PaymentSuccessHandlerFactory {
  static create(type: string, deps: any):PaymentSuccessHandler { 
    switch (type) {
      case "TENANT_REGISTRATION":
        return new TenantRegistrationHandler(deps.provisionerService);
      case "BOOKING_PAYMENT":
        return new BookingPaymentHandler(deps.bookingService);
      default:
        throw new Error("Unknown payment type");
    }
  }
}
