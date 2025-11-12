import express, { Router } from "express";
import asyncHandler from "../utils/asyncHandler";
import {
  loginController,
  logoutController,
  signupController,
} from "../controllers/authConroller";

const authRouter: Router = express.Router();

// No need to use express.json() here if already in app.ts
authRouter.post("/signup", asyncHandler(signupController));
authRouter.post("/login", asyncHandler(loginController));
authRouter.post("/logout",asyncHandler(logoutController));
export default authRouter;
