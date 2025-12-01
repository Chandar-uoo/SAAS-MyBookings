import { Request, Response, NextFunction } from "express";
import { tenantSchemaValidate } from "../validation/tenantSchemaValidate";
import { ValidationError } from "../utils/errors";

export const validateCreateTenant = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error,value } = tenantSchemaValidate.validate(req.body, {
    abortEarly: true // return only the FIRST error
  });

  if (error) {
    const message = error.details[0].message; 
    throw new ValidationError(message);
  }
req.body =  value;

  next();
};
