import { PrismaClient } from "@prisma/client";
import { BookingRepository } from "../repositories/bookingRepositary";
import { ParsedBookingTimes } from "../types/parsedBookingTimes";
import { UserServiceEntity } from "../types/userServiceEntity";
import { AppError } from "../utils/errors";
import { computeAppointmentAvailabilty } from "../stratigies/computeAppointmentAvailabilty";
import { computeTimeRangAvailabilty } from "../stratigies/computeTimeRangeAvailabilty";

export const computeAvailabilty = (
  resourceType: string,
  schemaName: string,
  service: UserServiceEntity,
  bookingReposiatry: BookingRepository,
  parsed: ParsedBookingTimes,
  client: PrismaClient,
  quantity?: number
) => {
  switch (resourceType) {
    case "APPOINTMENT_ENGINE":
      return computeAppointmentAvailabilty(
        schemaName,
        bookingReposiatry,
        service,
        parsed,
        client
      );

    case "TIME_RANGE_ENGINE":
      return computeTimeRangAvailabilty(
        schemaName,
        service,
        bookingReposiatry,
        parsed,
        client,
        quantity
      );

    default:
      throw new AppError("Resource type not valid", 404);
  }
};
