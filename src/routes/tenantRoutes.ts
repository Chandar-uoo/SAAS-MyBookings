import express, { Router } from "express";
import asyncHandler from "../utils/asyncHandler";
import { tenantController } from "../controllers/tenantController";
import { validateCreateTenant } from "../middlewares/validateTenantCreation";
import { platformAuthenticate } from "../middlewares/platformUserContext";
const tenantRouter: Router = express.Router();

// No need to use express.json() here if already in app.ts
tenantRouter.post("/register",platformAuthenticate,validateCreateTenant,asyncHandler(tenantController));

export default tenantRouter;
