import express, { Router } from "express";
import asyncHandler from "../utils/asyncHandler";
import { paymentController } from "../controllers/paymentController";
const paymentRouter: Router = express.Router();

// No need to use express.json() here if already in app.ts
paymentRouter.post("/razorpay/webhook",express.raw({ type: "application/json" }),asyncHandler(paymentController));

export default paymentRouter;
