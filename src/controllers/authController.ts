import { Request, Response } from "express";
import { JwtTokenProvider } from "../provider/implementations/jwtTokenProvider";
import { PasswordHasher } from "../provider/implementations/bcryptHasher";
import { AuthServices } from "../services/authServices";
import { AuthRepositary } from "../repositories/authRepositary";
import { LoginUserDto, RegisterUserDto } from "../dto/userDto";
const tokenProvider = new JwtTokenProvider();
const passwordHasher = new PasswordHasher();
const authRepositary = new AuthRepositary();
const AuthService = new AuthServices(
  authRepositary,
  passwordHasher,
  tokenProvider
);

export const SignupController = async (req: Request, res: Response) => {

  
  const {slug} =  req.params;
  const schemaName = `tenant_${slug}`;
  const data: RegisterUserDto = req.body;
  const { user, accessToken, refreshToken } = await AuthService.SignUpService(
    schemaName,
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

export const LoginController = async (req: Request, res: Response) => {
  const {slug} =  req.params;
  const schemaName = `tenant_${slug}`;
    const data:LoginUserDto =  req.body;
  const { user, accessToken, refreshToken } = await AuthService.LoginService(
    schemaName,
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
export const LogoutController = async (req: Request, res: Response) => {
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
