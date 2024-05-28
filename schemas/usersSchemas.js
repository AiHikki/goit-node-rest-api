import Joi from "joi";

export const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  subscription: Joi.string().valid("starter", "pro", "business"),
});

export const subscriptionSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});

export const verificationTokenSchema = Joi.object({
  email: Joi.string().email().required(),
});
