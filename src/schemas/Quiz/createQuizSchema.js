import Joi from "joi";

export const createQuizSchema = Joi.object({
  body: Joi.object({
    title: Joi.string().min(5).max(100).required().messages({
      "string.empty": "Quiz title is required.",
      "string.min": "Quiz title must be at least 5 character long.",
      "string.max": "Quiz title must not exceed 100 characters.",
      "any.required": "Quiz title is required.",
    }),
  }).required(),
}).unknown(true);
