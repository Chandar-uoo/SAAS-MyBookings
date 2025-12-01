import Joi from "joi";

export const updateServiceSchema = Joi.object({
  name: Joi.string().min(2),
  description: Joi.string().min(5),
  duration_minutes: Joi.number().min(5),
  capacity: Joi.number().min(1),
  price: Joi.number().positive().min(1),
}).min(1); 
