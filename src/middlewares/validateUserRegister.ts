import { Request, Response, NextFunction } from "express";
import { registerUserSchema } from "../validation/registerUserSchema";
import { AppError } from "../utils/errors";

export const validateUserRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error, value } = registerUserSchema.validate(req.body, {
    abortEarly: true,
  });

  if (error) {
    const message = error.details[0].message;
    return next(new AppError(message, 400));
  }
  req.body = value;

  next();
};
