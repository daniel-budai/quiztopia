import { db } from "../../../services/database/dynamodb.js";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import authMiddleware from "../../../middlewares/auth/authMiddleware.js";
import {
  sendResponse,
  sendError,
} from "../../../utils/responses/responseHandlers.js";

const getQuestionsByQuizId = async (event) => {
  const params = {
    TableName: process.env.QUESTIONS_TABLE,
  };

  try {
    const result = await db.scan(params);
    const questions = result.Items;

    return sendResponse(200, questions);
  } catch (error) {
    return sendError(500, { error: "Could not retrieve questions" });
  }
};

export const handler = middy(getQuestionsByQuizId)
  .use(httpErrorHandler())
  .use(authMiddleware());
