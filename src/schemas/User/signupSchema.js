import Joi from "joi";

export const signupSchema = Joi.object({
  body: Joi.object({
    username: Joi.string()
      .min(3)
      .message("Username must be at least 3 characters long.")
      .max(50)
      .message("Username must not exceed 50 characters.")
      .pattern(/^[a-zA-Z0-9_-]+$/)
      .message(
        "Username can only contain letters, numbers, underscores, and hyphens."
      )
      .required()
      .messages({
        "string.empty": "Username is required.",
        "any.required": "Username is required.",
      }),
    password: Joi.string()
      .min(6)
      .message("Password must be at least 6 characters long.")
      .max(100)
      .message("Password must not exceed 100 characters.")
      .required()
      .messages({
        "string.empty": "Password is required.",
        "any.required": "Password is required.",
      }),
  }).required(),
});
