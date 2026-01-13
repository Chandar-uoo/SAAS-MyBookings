
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { createBookingSchema } from "../validation/createBookingSchema";

export const validate =
  (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    const { value, error } = createBookingSchema.validate(req.body, {
      abortEarly: true,
    });

    if (error) {
      const message = error.details[0].message;
    return next(new AppError(message,400));
    }
    req.body = value;

    next();
  };
