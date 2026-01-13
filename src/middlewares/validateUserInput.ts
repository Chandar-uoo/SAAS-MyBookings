import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { userInputValidate } from "../validation/userInputValidate";
export const validateUserInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error,value } = userInputValidate
.validate(req.query, {
    abortEarly: true // return only the FIRST error
  });

  if (error) {
    const message = error.details[0].message; 
     return next(new AppError(message,400));
  }
  //@ts-ignore
req.validatedInput =  value;

  next();
};
