import express, { Router } from "express";
import asyncHandler from "../utils/asyncHandler";
import {
  platFormLoginController,
  platformSignupController,
  platformLogoutController,
} from "../controllers/platformAuthConroller";

const platformAuthRouter: Router = express.Router();

// No need to use express.json() here if already in app.ts
platformAuthRouter.post("/signup", asyncHandler(platformSignupController));
platformAuthRouter.post("/login", asyncHandler(platFormLoginController));
platformAuthRouter.post("/logout",asyncHandler(platformLogoutController));
export default platformAuthRouter;
