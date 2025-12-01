import Joi from "joi";

// ENUMS
const resourceTypes = ["APPOINTMENT_ENGINE", "TIME_RANGE_ENGINE"];
const paymentTypes = ["FULL", "ADVANCE", "NONE"];
const currencies = ["INR", "USD", "EUR"];
const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

// BASE SCHEMA (shared by create + update)
const baseTenantSchema = {

  businessName: Joi.string()
    .min(2)
    .max(100)
    .required(),

  slug: Joi.string()
    .lowercase()
    .trim()
    .min(3)
    .max(50)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .required(),

  category: Joi.string()
    .min(2)
    .max(100)
    .required(),

  address: Joi.string()
    .min(5)
    .max(255)
    .required(),

  city: Joi.string()
    .min(2)
    .max(100)
    .required(),

  country: Joi.string()
    .min(2)
    .max(100)
    .required(),

  resourceType: Joi.string()
    .valid(...resourceTypes)
    .required(),



openTime: Joi.string()
  .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
  .required(),

closeTime: Joi.string()
  .pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
  .required(),

  daysAvailable: Joi.array()
    .items(Joi.string().valid(...days))
    .min(1)
    .required(),

  paymentRequired: Joi.boolean().required(),

  paymentType: Joi.string()
    .valid(...paymentTypes)
    .when("paymentRequired", {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional().valid("NONE"),
    }),

  currency: Joi.string()
    .valid(...currencies)
    .default("INR"),
};

// 👉 CREATE validation
export const tenantSchemaValidate = Joi.object(baseTenantSchema);