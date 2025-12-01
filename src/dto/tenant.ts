 import { ResourceType } from "@prisma/client";
export interface CreateTenantDTO {
  businessName: string;
  slug: string;
  category: string;
  address: string;
  city: string;
  country: string;

  resourceType: ResourceType;

  openTime?: string;
  closeTime?: string;

  daysAvailable: string[];

  paymentRequired: boolean;
  paymentType?: string;
  currency?: string;
}

export interface ActivateTenantDTO {
  bookingURL: string;
  dashboardURL: string;
  plan: string;
  subscriptionStatus: string;
}


