import express, { Router } from "express";
import asyncHandler from "../utils/asyncHandler";
import { tenantContextMiddleware } from "../middlewares/tenantContext";
import { serviceCreateController, serviceDeleteController, serviceReadController, serviceUpdateController } from "../controllers/adminController";
import { validateCreateService } from "../middlewares/validateServiceCreation";
import { validateUpdateService } from "../middlewares/validateServiceUpdation";
import { serviceContextMiddleware } from "../middlewares/serviceContext";
import { authenticateUser } from "../middlewares/userContext";

const adminRouter: Router = express.Router({mergeParams:true});
// later add service middleware
// create
adminRouter.post("/services/create",authenticateUser,tenantContextMiddleware,validateCreateService,asyncHandler(serviceCreateController));
// read 
adminRouter.get("/services/read",authenticateUser,tenantContextMiddleware,asyncHandler(serviceReadController));
//update
adminRouter.patch("/services/update/:id",authenticateUser,tenantContextMiddleware,serviceContextMiddleware,validateUpdateService,asyncHandler(serviceUpdateController));
//delete
adminRouter.delete("/services/delete/:id",authenticateUser,tenantContextMiddleware,serviceContextMiddleware,asyncHandler(serviceDeleteController));

export default adminRouter;
