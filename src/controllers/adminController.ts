import { Request, Response } from "express";
import { AdminServices } from "../services/adminServices";
import { AdminRepository } from "../repositories/adminRepositary";
import { CreateServiceDTO, UpdateServiceDTO } from "../dto/adminDto";
const adminRepositary = new AdminRepository();
const adminServices = new AdminServices(adminRepositary);

export const serviceCreateController = async (req: Request, res: Response) => {
  //@ts-ignore
  const tenant = req.tenant;
  const data: CreateServiceDTO = req.body;
  const { created } = await adminServices.createService(tenant, data);

  return res.status(201).json({
    status: "success",
    data: created,
  });
};
export const serviceReadController = async (req: Request, res: Response) => {
  //@ts-ignore
  const tenant = req.tenant;
  const { services } = await adminServices.readServices(tenant);

  return res.status(200).json({
    status: "success",
    data: services,
  });
};

export const serviceUpdateController = async (req: Request, res: Response) => {
  //@ts-ignore

  const tenant = req.tenant;
  //@ts-ignore
  const service = req.service;
  const update: UpdateServiceDTO = req.body;

  const { updates } = await adminServices.updateService(
    tenant,
    update,
    service
  );
  return res.status(200).json({
    status: "success",
    data: updates,
  });
};

export const serviceDeleteController = async (req: Request, res: Response) => {
  //@ts-ignore

  const tenant = req.tenant;
  //@ts-ignore
  const service = req.service;
   await adminServices.deleteService(
    tenant,
    service
  );
  return res.status(204).send();
};
