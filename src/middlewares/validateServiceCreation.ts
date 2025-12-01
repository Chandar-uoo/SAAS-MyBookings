import { Request,Response,NextFunction } from "express";
import { ValidationError } from "../utils/errors";
import { validateServiceSchema } from "../validation/serviceModelValidation";
export const validateCreateService = (req:Request, res:Response, next:NextFunction) => {
  const { error,value} = validateServiceSchema.validate(req.body, { abortEarly: true });

  if (error) {
   throw new  ValidationError(`Validation failed. Please check your input ${error}`);
  }
  req.body = value;
  next();
};
