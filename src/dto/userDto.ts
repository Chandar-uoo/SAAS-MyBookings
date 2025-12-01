// booking.dto.ts

export interface BookingInputDTO {
  date: string;           // must be YYYY-MM-DD
  startTime?: string;     // optional, HH:MM
  endTime?: string;       // optional, HH:MM
  quantity?: number;      // optional, min 1
}

export interface RegisterUserDto {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginUserDto {
    email: string;
      password: string;

}
export interface BookingCreateDTO {
  date: string;           // must be YYYY-MM-DD
  startTime: string;     // optional, HH:MM
  endTime: string;       // optional, HH:MM
  quantity?: number;      // optional, min 1
}
