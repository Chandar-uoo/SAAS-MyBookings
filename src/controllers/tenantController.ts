import { Request, Response } from "express";
import { TenantService } from "../services/tenantServices";
import { TenantRepositary } from "../repositories/tenantRepositary";
import { RzpyHelper } from "../provider/implementations/rzpyHandlers";
import { CreateTenantDTO } from "../dto/tenant";

const rzpyHelper =  new RzpyHelper();
const tenantRepositary =  new TenantRepositary()
const tenantService =  new TenantService(tenantRepositary,rzpyHelper);


export const tenantController = async (req: Request, res: Response) => {
  //@ts-ignore
    const user = req.user; 
  const data : CreateTenantDTO =  req.body;
  const { orderId } = await tenantService.createTenantService(user.id,
   data
  );
  return res.status(201).json({
    status: "success",
    body:orderId,
  });
};
