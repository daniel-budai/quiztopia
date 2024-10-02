import Joi from "joi";

export const addScoreSchema = Joi.object({
  body: Joi.object({
    answers: Joi.array()
      .items(
        Joi.object({
          answer: Joi.string()
            .regex(/^(?!\s*$)[A-Za-z\s-]+$/)
            .required()
            .messages({
              "string.empty": "Answer is required.",
              "string.pattern.base":
                "Answer must contain only letters, spaces, and hyphens.",
              "any.required": "Answer is required.",
            }),
          latitude: Joi.number().min(-90).max(90).required().messages({
            "number.base": "Latitude must be a number.",
            "number.min": "Latitude must be at least -90.",
            "number.max": "Latitude must not exceed 90.",
            "any.required": "Latitude is required.",
          }),
          longitude: Joi.number().min(-180).max(180).required().messages({
            "number.base": "Longitude must be a number.",
            "number.min": "Longitude must be at least -180.",
            "number.max": "Longitude must not exceed 180.",
            "any.required": "Longitude is required.",
          }),
        })
      )
      .min(1)
      .required()
      .messages({
        "array.min": "At least one answer is required.",
        "any.required": "Answers are required.",
      }),
  }).required(),
  pathParameters: Joi.object({
    quizId: Joi.string().required().messages({
      "string.empty": "Quiz ID is required.",
      "any.required": "Quiz ID is required.",
    }),
  }).required(),
}).unknown(true);
