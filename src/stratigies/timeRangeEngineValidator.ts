import { CreateServiceDTO } from "../dto/adminDto";
import { IServiceValidator } from "../provider/interfaces/IServiceValidator";
import { AppError } from "../utils/errors";

export class TimeRangeEngineValidate implements IServiceValidator {
  async validate(data: any) {
    if (data.capacity !== undefined && data.capacity <= 0) {
      throw new AppError("Capacity must be greater than 0", 400);
    }
  }
}
