
export interface CreateServiceDTO {
  name: string;
  description: string;
  duration_minutes?: number;   
  capacity?: number;          
  price?: number;
  meta?: any;                 
}

export interface UpdateServiceDTO {
  name?: string;
  description?: string;
  duration_minutes?: number;
  capacity?: number;
  price?: number;
  meta?: any;
}
