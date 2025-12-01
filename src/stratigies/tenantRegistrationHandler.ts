import { PaymentSuccessHandler } from "../provider/interfaces/IPaymentSuccessHandler";
import { ProvisionerService } from "../services/provisionerService";

export class TenantRegistrationHandler implements PaymentSuccessHandler {
  constructor(private provisionerService: ProvisionerService) {}
  async handle(paymentIntent: any, paymentId: string): Promise<void> {
    const tenantId = paymentIntent.tenantId;
    await this.provisionerService.provisionTenant(tenantId, paymentId);
    console.log("Provisioning completed for tenant:", tenantId);
  }
}
