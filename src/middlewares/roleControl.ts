import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";

export const roleContolMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    //@ts-ignore
    const user = req.user;

    if (user.role != "ADMIN") {
      return next(new AppError("Access denied", 403));
    }

    next();
  
};
