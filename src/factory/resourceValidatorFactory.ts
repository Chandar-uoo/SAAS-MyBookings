import { AppointmentEngineValidator } from "../stratigies/appointmentEngineValidator";
import { TimeRangeEngineValidate } from "../stratigies/timeRangeEngineValidator";
import { AppError } from "../utils/errors";

export class ResourceValidatorFactory {
  static resource(resourceType: string) {
    switch (resourceType) {
      case "APPOINTMENT_ENGINE":
        return new AppointmentEngineValidator();

      case "TIME_RANGE_ENGINE":
        return new TimeRangeEngineValidate();

      default:
        throw new AppError("Invalid resourceType in tenant", 400);
    }
  }
}
