import Joi from "joi";

const inputSchema = {
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required(),
  startTime: Joi.string()
    .pattern(/^\d{2}:\d{2}$/)
    .optional(),
  endTime: Joi.string()
    .pattern(/^\d{2}:\d{2}$/)
    .optional(),

  quantity: Joi.number().integer().min(1).optional(),
};

// 👉 CREATE validation
export const userInputValidate = Joi.object(inputSchema);
