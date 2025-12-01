import { AppointmentEngine } from "../stratigies/appointmentEngine";
import { BookingRepository } from "../repositories/bookingRepositary";
import { ServiceEntity } from "../types/serviceEntity";
import { TimeRangeEngine } from "../stratigies/timeRangeEngine";

export class BookingEngineFactory {
  static create(resourceType: string, repo: BookingRepository, service: ServiceEntity, ctx: any) {
    switch (resourceType) {
      case "APPOINTMENT_ENGINE":
        return new AppointmentEngine(repo, service, ctx);

      case "TIME_RANGE_ENGINE":
        return new TimeRangeEngine(repo, service, ctx);

      default:
        throw new Error("Invalid resource type");
    }
  }
}
