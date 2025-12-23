// create an booking
export interface CreateBookingInput {
  date: string;
  startTime: string;
  endTime: string;
  quantity?: number;
}

// booking.dto.ts

// check availabilty
export interface BookingInputDTO {
  date: string;           // must be YYYY-MM-DD
  startTime?: string;     // optional, HH:MM
  endTime?: string;       // optional, HH:MM
  quantity?: number;      // optional, min 1
}
