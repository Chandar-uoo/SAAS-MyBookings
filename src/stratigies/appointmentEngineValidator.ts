import { IServiceValidator } from "../provider/interfaces/IServiceValidator";
import { AppError } from "../utils/errors";

export class AppointmentEngineValidator implements IServiceValidator {
  async validate(data: any) {
    if (
      data.duration_minutes === undefined ||
      data.duration_minutes === null ||
      data.duration_minutes <= 0
    ) {
      throw new AppError("duration_minutes must be valid", 400);
    }

    data.capacity = 1;
  }
}
