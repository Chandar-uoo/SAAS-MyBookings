import { Request, Response } from "express";
import { BookingRepository } from "../repositories/bookingRepositary";
import { ServiceRepositary } from "../repositories/serviceRepositary";
import { UserServices } from "../services/userService";
import { BookingInputDTO } from "../dto/userDto";
import { CreateBookingInput } from "../types/Booking";
import { RzpyHelper } from "../provider/implementations/rzpyHandlers";
const bookingReposiatry = new BookingRepository();
const serviceRepositary = new ServiceRepositary();
const rzpyHelper = new RzpyHelper();

const userServices = new UserServices(
  serviceRepositary,
  bookingReposiatry,
  rzpyHelper
);

export const readServicesController = async (req: Request, res: Response) => {
  //@ts-ignore

  const tenant = req.tenant;

  const { services } = await userServices.readServices(tenant);
  return res.status(200).json({
    status: "success",
    data: services,
  });
};

export const readSlotsController = async (req: Request, res: Response) => {
  //@ts-ignore

  const tenant = req.tenant;
  // @ts-ignore
  const service = req.service;
  //@ts-ignore
  const validatedInput = req.validatedInput
  const data: BookingInputDTO = validatedInput;
  const result = await userServices.readSlots(service, tenant, data);
  return res.status(200).json({
    status: "success",
    data: result,
  });
};

export const bookingController = async (req: Request, res: Response) => {
  //@ts-ignore
  const tenant = req.tenant;
  //@ts-ignore
  const service = req.service;
  //@ts-ignore
  const user_id = req.user.id;

  const data: CreateBookingInput = req.body;
  const result = await userServices.BookingService(
    user_id,
    tenant,
    service,
    data
  );
  return res.status(200).json({
    status: "success",
    data: result,
  });
};
