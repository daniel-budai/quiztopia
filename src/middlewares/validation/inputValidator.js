import { sendError } from "../../utils/responses/responseHandlers.js";

export const inputValidator = (schema) => {
  return {
    before: (request) => {
      const { error, value } = schema.validate(request.event, {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true,
      });
      if (error) {
        console.error("Validation error:", JSON.stringify(error, null, 2));
        const messages = error.details.map((detail) => detail.message);
        return sendError(400, { error: "Validation failed", messages });
      }
      request.event = value;
    },
    onError: (request) => {
      console.error("Unexpected error:", request.error);
      return sendError(500, { error: "An unexpected error occurred" });
    },
  };
};
