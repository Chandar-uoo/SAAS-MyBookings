import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import { registerUserSchema } from "../validation/registerUserSchema";
import { ValidationError } from "../utils/errors";

export const validateUserRegister =
  (schema: ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = registerUserSchema.validate(req.body, {
      abortEarly: true,
    });

    if (error) {
      const message = error.details[0].message;
      throw new ValidationError(message);
    }
    req.body = value;

    next();
  };
