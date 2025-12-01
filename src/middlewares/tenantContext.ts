import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { TenantRepositary } from "../repositories/tenantRepositary";

const tenantRepositary = new TenantRepositary()

export const tenantContextMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params;
    if (!slug) throw new AppError("SLUG_NOT_FOUND ", 400);
    const tenant = await tenantRepositary.findBySlug(slug);

    if (!tenant) throw new AppError("TENANT_NOT_FOUND ", 404);
    // @ts-ignore
    req.tenant = tenant;
    next();
  } catch (error) {
    next(error);
  }
};
