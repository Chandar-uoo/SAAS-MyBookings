import { Request, Response } from "express";
import { PlatformAuthService } from "../services/platformAuthServices";
import { JwtTokenProvider } from "../provider/implementations/jwtTokenProvider";
import { PasswordHasher } from "../provider/implementations/bcryptHasher";
import { LoginUserDto, PlatformRegisterUserDto } from "../dto/userDto";

const tokenProvider = new JwtTokenProvider();
const passwordHasher = new PasswordHasher();
const platformAuthService = new PlatformAuthService(tokenProvider, passwordHasher);

export const platformSignupController = async (req: Request, res: Response) => {
  const data:PlatformRegisterUserDto =  req.body;
  const { user, accessToken, refreshToken } = await platformAuthService.PlatformSignupService(
    data
  );
  return res.status(201).json({
    status: "success",
    user,
    tokens: {
      accessToken,
      refreshToken,
    },
  });
};

export const platFormLoginController = async (req: Request, res: Response) => {
  const data : LoginUserDto = req.body;
  const { user, accessToken, refreshToken } = await platformAuthService.PlatformLoginService(
    data
  );
  return res.status(200).json({
    status: "success",
    user,
    tokens: {
      accessToken,
      refreshToken,
    },
  });
};
export const platformLogoutController = async (req: Request, res: Response) => {

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });
  
  return res.status(200).json({
    status: "success",
    message: "logout succesfully",
  });
};
