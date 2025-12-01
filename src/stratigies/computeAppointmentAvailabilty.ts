import { PrismaClient } from "@prisma/client";
import { BookingRepository } from "../repositories/bookingRepositary";
import { ParsedBookingTimes } from "../types/parsedBookingTimes";
import { ServiceEntity } from "../types/serviceEntity";
import { UserServiceEntity } from "../types/userServiceEntity";
import { AppError } from "../utils/errors";
import { generateAvailableSlots } from "../utils/generateAvailableSlots";

export const computeAppointmentAvailabilty = async (
  schemaName: string,
  bookingReposiatry: BookingRepository,
  service: UserServiceEntity,
  parsed: ParsedBookingTimes,
  client:PrismaClient
) => {
  if (!service.duration_minutes) throw new AppError("no avg", 400);

  const booked = await bookingReposiatry.getBookingsForDate(
    schemaName,
    service.id,
    parsed.givenDate,
    client
  );

  const slots = generateAvailableSlots(
    parsed.businessOpenTime,
    parsed.businessCloseTime,
    service.duration_minutes,
    booked,
  );

  return {slots};
};
