import { db } from "../../../services/database/dynamodb.js";
import { comparePassword } from "../../../utils/bcrypt/bcryptUtils.js";
import { generateToken } from "../../../utils/jwt/tokenUtils.js";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import {
  sendResponse,
  sendError,
} from "../../../utils/responses/responseHandlers.js";

const login = async (event) => {
  const { username, password } = event.body;

  if (!username || !password) {
    return sendError(400, { error: "Username and password are required" });
  }

  try {
    const params = {
      TableName: process.env.ACCOUNTS_TABLE,
      IndexName: "UsernameIndex",
      KeyConditionExpression: "username = :username",
      ExpressionAttributeValues: {
        ":username": username,
      },
    };

    const result = await db.query(params);
    const account = result.Items[0];

    if (!account) {
      return sendError(401, { error: "Invalid username or password" });
    }

    const isPasswordValid = await comparePassword(password, account.password);

    if (!isPasswordValid) {
      return sendError(401, { error: "Invalid username or password" });
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
  .use(httpErrorHandler());
