import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { JwtTokenProvider } from "../provider/implementations/jwtTokenProvider";
import { AuthRepositary } from "../repositories/authRepositary";
const tokenProvider = new JwtTokenProvider();
const authRepositary = new AuthRepositary();
export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Extract token
    const authHeader = req.headers.authorization;
    const { slug } = req.params;

    if (!slug) throw new AppError("slug needed", 400);
    const schemaName = `tenant_${slug}`;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Access token missing", 401);
    }

    const token = authHeader.split(" ")[1];

    const decoded = tokenProvider.verifyAccessToken(token);

    const user = await authRepositary.findUserById(schemaName, decoded.id);
    if (!user) throw new AppError("User not found", 404);
    //@ts-ignore
    req.user = user;

    next();
  } catch (error: any) {
    // token expired
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Access token expired", 401));
    }

    next(error);
  }
};
