import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";

export const roleContolMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //@ts-ignore
    const user = req.user;

    if (user.role != "ADMIN") {
      throw new AppError("Access denied", 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};
