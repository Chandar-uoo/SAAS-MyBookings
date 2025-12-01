import { Request, Response, NextFunction } from "express";


const asyncHandler = (callback: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await callback(req, res, next);
    } catch (error) {
      next(error); 
    }
  };
};

export default asyncHandler;

/* //“I am defining a function that takes a callback function as its argument.
That callback function must:

accept (req, res, next) as parameters, and

return a Promise (because it’s async).” */