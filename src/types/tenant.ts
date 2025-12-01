export interface TenantBusinessInfo {
  id: string;
  businessName: string;
  slug: string;
  category: string;
  resourceType:string;
  openTime: string;
  closeTime: string;
  daysAvailable: string[];
  paymentRequired: boolean;
  paymentType: string;
}
