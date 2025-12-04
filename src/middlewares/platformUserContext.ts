
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { JwtTokenProvider } from "../provider/implementations/jwtTokenProvider";
import { PlatformUserRepository } from "../repositories/platformUserRepository";
PlatformUserRepository
const tokenProvider = new JwtTokenProvider();
const platformUserRepository =  new PlatformUserRepository();
export const platformAuthenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Extract token
    const authHeader = req.headers.authorization;


    if (!authHeader || !authHeader.startsWith("Bearer")) {
      throw new AppError("Access token missing", 401);
    }

    const token = authHeader.split(" ")[1];

    const decoded = tokenProvider.verifyAccessToken(token);
    if(!decoded)   throw new AppError("Login Again", 404);
    console.log(decoded);
    
    const user = await platformUserRepository.findUserById(decoded.id);
    if (!user) throw new AppError("User not found", 404);
    //@ts-ignore
    req.user = user;

    next();
  } catch (error:any) {
      // token expired
    if (error.name === 'TokenExpiredError') {
        throw new AppError("Access token expired", 401);
    }

    // invalid token
    throw new AppError("Invalid access token", 401);
  }
};
