import { db } from "../../../services/database/dynamodb.js";
import { hashPassword } from "../../../utils/bcrypt/bcryptUtils.js";
import { v4 as uuidv4 } from "uuid";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import {
  sendResponse,
  sendError,
} from "../../../utils/responses/responseHandlers.js";

const signup = async (event) => {
  const { username, password } = event.body;

  if (!username || !password) {
    return sendError(400, { error: "Username and password are required" });
  }

  try {
    const hashedPassword = await hashPassword(password);
    const accountId = uuidv4();

    const params = {
      TableName: process.env.ACCOUNTS_TABLE,
      Item: {
        accountId: accountId,
        username,
        password: hashedPassword,
      },
    };

    await db.put(params);

    return sendResponse(201, { message: "Account created successfully" });
  } catch (error) {
    console.error("Error creating account:", error);
    return sendError(500, { error: "Could not create account" });
  }
};

export const handler = middy(signup)
  .use(jsonBodyParser())
  .use(httpErrorHandler());
