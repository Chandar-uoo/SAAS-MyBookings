import { Prisma } from "@prisma/client";
import {PaymentRepositary} from "../../repositories/paymentRepositary"

export interface IUnitOfWork {
    paymentRepositary:PaymentRepositary;
    complete<T>(work:(tx:Prisma.TransactionClient)=>Promise<T>):Promise<T>
}