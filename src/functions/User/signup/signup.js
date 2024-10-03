import { createUser } from "../../../helpers/User/userHelpers.js";
import { hashPassword } from "../../../utils/bcrypt/bcryptUtils.js";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { inputValidator } from "../../../middlewares/validation/inputValidator.js";
import { signupSchema } from "../../../schemas/User/signupSchema.js";
import {
  sendResponse,
  sendError,
} from "../../../utils/responses/responseHandlers.js";

const signup = async (event) => {
  const { username, password } = event.body;

  try {
    const hashedPassword = await hashPassword(password);
    const accountId = await createUser(username, hashedPassword);

    return sendResponse(201, {
      message: "Account created successfully",
    });
  } catch (error) {
    console.error("Error creating account:", error);
    if (error.message === "Username already exists") {
      return sendError(409, { error: error.message });
    }
    return sendError(500, { error: "Could not create account" });
  }
};

export const handler = middy(signup)
  .use(jsonBodyParser())
  .use(inputValidator(signupSchema));
