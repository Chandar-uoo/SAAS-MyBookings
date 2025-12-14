import { PrismaClient } from "@prisma/client";
import { BookingRepository } from "../repositories/bookingRepositary";
import { ParsedBookingTimes } from "../types/parsedBookingTimes";
import { UserServiceEntity } from "../types/userServiceEntity";
import { AppError } from "../utils/errors";

export const computeTimeRangAvailabilty = async (
  schemaName: string,
  service: UserServiceEntity,
  bookingReposiatry: BookingRepository,
  parsed: ParsedBookingTimes,
  client: PrismaClient,
  quantity?: number
) => {
  const hasCapcity =
    service.capacity !== null && service.capacity !== undefined;

  if (!parsed.startDateTime || !parsed.endDateTime)
    throw new AppError("Time Required", 400);
  if (hasCapcity && !quantity) throw new AppError("quantity needed", 400);

  if (!hasCapcity) {
    const conflicts = await bookingReposiatry.countOverLapping(
      schemaName,
      service.id,
      parsed.startDateTime,
      parsed.endDateTime,
      client
    );
    return { available: conflicts === 0 };
  }
  const usedQty = await bookingReposiatry.sumOverlappingQuantities(
    schemaName,
    service.id,
    parsed.startDateTime,
    parsed.endDateTime,
    client
  );


  const avlQty = service.capacity! - usedQty;

  return { avlQty };
};
