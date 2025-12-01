export interface UserServiceEntity {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number | null;
  capacity?: number | null;
  price?: number | null;
  meta?:any|null
}

