import Joi from "joi";

export const registerUserSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required(),

  email: Joi.string()
    .trim()
    .email()
    .lowercase()
    .required(),

  phone: Joi.string()
    .trim()
    .pattern(/^[0-9]{10,15}$/) // only digits, 10–15 length
    .optional(),

  password: Joi.string()
    .min(6)
    .max(100)
    .required(),
});
