import express, { Router } from "express";
import asyncHandler from "../utils/asyncHandler";
import {
  LoginController,
  SignupController,
  LogoutController,
} from "../controllers/authController";

const authRouter: Router = express.Router({mergeParams:true});

authRouter.post("/signup", asyncHandler(SignupController));
authRouter.post("/login", asyncHandler(LoginController));
authRouter.post("/logout",asyncHandler(LogoutController));
export default authRouter;
