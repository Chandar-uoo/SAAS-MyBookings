export interface CreatePaymentDto {
  tenantId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  rawPayload: any;
}

export interface UpdatePaymentStatusDto {
  status: "SUCCESS" | "FAILED";
  finalStatus?: "SUCCESS" | "FAILED_PERMANENT";
  processed?: boolean;
  retryCount?: number;
  lastTriedAt?: string;
}
