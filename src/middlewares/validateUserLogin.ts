// src/middlewares/validate.middleware.ts

import { Request, Response, NextFunction } from "express";
import { loginSchema } from "../validation/loginUserValidation";
import { AppError } from "../utils/errors";

export const validate =
  (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    const { value, error } = loginSchema.validate(req.body, {
      abortEarly: true,
    });

    if (error) {
      const message = error.details[0].message;
      throw new AppError(message,400);
    }
    req.body = value;

    next();
  };
