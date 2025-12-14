import express, { Router } from "express";
import asyncHandler from "../utils/asyncHandler";
import { validateUserInput } from "../middlewares/validateUserInput";
import { bookingController, readServicesController, readSlotsController } from "../controllers/userController";
import { tenantContextMiddleware } from "../middlewares/tenantContext";
import { serviceContextMiddleware } from "../middlewares/serviceContext";
import { authenticateUser } from "../middlewares/userContext";


const userServiceRouter: Router = express.Router({mergeParams:true});

// read Slots
userServiceRouter.get("/availability/:id",authenticateUser,tenantContextMiddleware,serviceContextMiddleware,validateUserInput,asyncHandler(readSlotsController));
// read 
userServiceRouter.get("/",tenantContextMiddleware,asyncHandler(readServicesController));
// booking
userServiceRouter.get("/bookings/:id",authenticateUser,tenantContextMiddleware,serviceContextMiddleware,asyncHandler(bookingController));

export default userServiceRouter;
