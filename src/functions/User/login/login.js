import { getUserByUsername } from "../../../helpers/User/userHelpers.js";
import { comparePassword } from "../../../utils/bcrypt/bcryptUtils.js";
import { generateToken } from "../../../utils/jwt/tokenUtils.js";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { inputValidator } from "../../../middlewares/validation/inputValidator.js";
import { loginSchema } from "../../../schemas/User/loginSchema.js";
import {
  sendResponse,
  sendError,
} from "../../../utils/responses/responseHandlers.js";

const login = async (event) => {
  const { username, password } = event.body;

  try {
    const account = await getUserByUsername(username);

    if (!account) {
      return sendError(401, { error: "No user with that username found" });
    }

    const isPasswordValid = await comparePassword(password, account.password);

    if (!isPasswordValid) {
      return sendError(401, { error: "Invalid password" });
    }

    const token = generateToken(account.accountId);

    return sendResponse(200, { message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in account:", error);
    return sendError(500, { error: "Could not log in account" });
  }
};

export const handler = middy(login)
  .use(jsonBodyParser())
  .use(inputValidator(loginSchema));
