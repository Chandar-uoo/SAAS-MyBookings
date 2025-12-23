import express, { Router } from "express";
import asyncHandler from "../utils/asyncHandler";
import { tenantContextMiddleware } from "../middlewares/tenantContext";
import { serviceCreateController, serviceDeleteController, serviceReadController, serviceUpdateController } from "../controllers/adminController";
import { validateCreateService } from "../middlewares/validateServiceCreation";
import { validateUpdateService } from "../middlewares/validateServiceUpdation";
import { serviceContextMiddleware } from "../middlewares/serviceContext";
import { authenticateUser } from "../middlewares/userContext";
import { roleContolMiddleware } from "../middlewares/roleControl";

const adminRouter: Router = express.Router({mergeParams:true});

// create
adminRouter.post("/services",authenticateUser,roleContolMiddleware,tenantContextMiddleware,validateCreateService,asyncHandler(serviceCreateController));
// read 
adminRouter.get("/services",authenticateUser,roleContolMiddleware,tenantContextMiddleware,asyncHandler(serviceReadController));
//update
adminRouter.patch("/services/:id",authenticateUser,roleContolMiddleware,tenantContextMiddleware,serviceContextMiddleware,validateUpdateService,asyncHandler(serviceUpdateController));
//delete
adminRouter.delete("/services/:id",authenticateUser,roleContolMiddleware,tenantContextMiddleware,serviceContextMiddleware,asyncHandler(serviceDeleteController));

export default adminRouter;
