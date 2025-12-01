
export  interface IPaymentHandlers {
createOrder(meta:any,amount:number):Promise<{orderId:string}>,
 verifyWebhook(signature: string, rawBody: string): boolean;
}