
export interface IServiceValidator{
    validate(data:any):Promise<void>;
}