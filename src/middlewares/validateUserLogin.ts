// src/middlewares/validate.middleware.ts

import { Request, Response, NextFunction } from "express";
import { loginSchema } from "../validation/loginUserValidation";
import { ValidationError } from "../utils/errors";

export const validate =
  (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    const { value, error } = loginSchema.validate(req.body, {
      abortEarly: true,
    });

    if (error) {
      const message = error.details[0].message;
      throw new ValidationError(message);
    }
    req.body = value;

    next();
  };
