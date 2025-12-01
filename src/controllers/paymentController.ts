import { Request, Response } from "express";
import { PaymentService } from "../services/paymentServices";
import { RzpyHelper } from "../provider/implementations/rzpyHandlers";
import { PaymentRepositary } from "../repositories/paymentRepositary";
const rzpyHelper = new RzpyHelper();
const paymentRepositary = new PaymentRepositary();
const paymentService = new PaymentService(paymentRepositary, rzpyHelper);

export const paymentController = async (req: Request, res: Response) => {
  const signature = req.headers["x-razorpay-signature"] as string;
  const rawBody = req.body.toString("utf-8");
  await paymentService.processWebhook(signature, rawBody);
  return res.status(200).json({
    status: "success",
  });
};
