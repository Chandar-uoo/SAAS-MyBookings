import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../utils/errors";
import { userInputValidate } from "../validation/userInputValidate";
export const validateUserInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error,value } = userInputValidate
.validate(req.body, {
    abortEarly: true // return only the FIRST error
  });

  if (error) {
    const message = error.details[0].message; 
    throw new ValidationError(message);
  }
req.body =  value;

  next();
};
