import { Request, Response } from "express";
import { AuthService } from "../services/authServices";
import { JwtTokenProvider } from "../provider/implementations/jwtTokenProvider";
import { PasswordHasher } from "../provider/implementations/bcryptHasher";
const tokenProvider = new JwtTokenProvider();
const passwordHasher = new PasswordHasher();
const authService = new AuthService(tokenProvider, passwordHasher);

export const signupController = async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await authService.SignupService(
    req.body
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

export const loginController = async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await authService.LoginService(
    req.body
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
export const logoutController = async (req: Request, res: Response) => {

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
