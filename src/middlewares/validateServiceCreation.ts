import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { validateServiceSchema } from "../validation/serviceModelValidation";
export const validateCreateService = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error, value } = validateServiceSchema.validate(req.body, {
    abortEarly: true,
  });

  if (error) {
    const message = error.details[0].message;
   return next(new AppError(message,400));
  }
  req.body = value;
  next();
};
