import Joi from "joi";

export const validateServiceSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(500).required(),

    duration_minutes: Joi.number().integer().min(1).optional(),
    capacity: Joi.number().integer().min(1).optional(),

    price: Joi.number().precision(2).positive().optional(),

    meta: Joi.object().optional(),
});
