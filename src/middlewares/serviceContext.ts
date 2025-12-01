import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { AdminRepository } from "../repositories/adminRepositary";
import { validateUUID } from "../utils/validateUUid";

const adminRepositary = new AdminRepository();

export const serviceContextMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params;
    const { id } = req.params;
    const schemaName = `tenant_${slug}`;
        if (!validateUUID(id)) throw new AppError("Invalid UUID", 400);

    const service = await adminRepositary.getServiceById(schemaName, id);
    if (!service) throw new AppError("SERVICE_NOT_FOUND ", 404);
    // @ts-ignore
    req.service = service;
    next();
  } catch (error) {
    next(error);
  }
};
