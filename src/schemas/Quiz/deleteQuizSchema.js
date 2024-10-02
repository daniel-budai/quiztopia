import Joi from "joi";

export const deleteQuizSchema = Joi.object({
  pathParameters: Joi.object({
    quizId: Joi.string().required().messages({
      "string.empty": "Quiz ID is required.",
      "any.required": "Quiz ID is required.",
    }),
  }).required(),
}).unknown(true);
