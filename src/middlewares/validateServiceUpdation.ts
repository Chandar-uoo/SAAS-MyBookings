
import { Request,Response,NextFunction } from "express";
import { AppError } from "../utils/errors";
import { updateServiceSchema } from "../validation/updateSchemaValidation";

export const validateUpdateService = (req:Request, res:Response, next:NextFunction) => {
  const { error,value} = updateServiceSchema.validate(req.body, { abortEarly: true });

 if (error) {
      const message = error.details[0].message;
      throw new AppError(message,400);
    }
  req.body = value;
  next();
};
