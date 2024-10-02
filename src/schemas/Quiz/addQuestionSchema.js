import Joi from "joi";

export const addQuestionSchema = Joi.object({
  body: Joi.object({
    question: Joi.string()
      .min(1)
      .max(500)
      .required()
      .custom((value, helpers) => {
        if (!isNaN(value)) {
          return helpers.error("string.notNumber");
        }
        return value;
      })
      .messages({
        "string.empty": "Question is required.",
        "string.min": "Question must be at least 1 character long.",
        "string.max": "Question must not exceed 500 characters.",
        "any.required": "Question is required.",
        "string.notNumber":
          "Question must contain letters, no numbers are allowed.",
      }),
    answer: Joi.string()
      .min(1)
      .max(200)
      .required()
      .custom((value, helpers) => {
        if (!isNaN(value)) {
          return helpers.error("string.notNumber");
        }
        return value;
      })
      .messages({
        "string.empty": "Answer is required.",
        "string.min": "Answer must be at least 1 character long.",
        "string.max": "Answer must not exceed 200 characters.",
        "any.required": "Answer is required.",
        "string.notNumber": "Answer must contain letters, no numbers",
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
  }).required(),
  pathParameters: Joi.object({
    quizId: Joi.string().required().messages({
      "string.empty": "Quiz ID is required.",
      "any.required": "Quiz ID is required.",
    }),
  }).required(),
}).unknown(true);
