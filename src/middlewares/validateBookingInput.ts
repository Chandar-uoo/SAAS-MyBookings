
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../utils/errors";
import { createBookingSchema } from "../validation/createBookingSchema";

export const validate =
  (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    const { value, error } = createBookingSchema.validate(req.body, {
      abortEarly: true,
    });

    if (error) {
      const message = error.details[0].message;
      throw new ValidationError(message);
    }
    req.body = value;

    next();
  };
