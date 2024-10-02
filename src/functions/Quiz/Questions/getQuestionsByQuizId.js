import { db } from "../../../services/database/dynamodb.js";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import authMiddleware from "../../../middlewares/auth/authMiddleware.js";
import {
  sendResponse,
  sendError,
} from "../../../utils/responses/responseHandlers.js";

const getQuestionsByQuizId = async (event) => {
  const { quizId } = event.pathParameters;
  const params = {
    TableName: process.env.QUESTIONS_TABLE,
    IndexName: "QuizIdIndex",
    KeyConditionExpression: "quizId = :quizId",
    ExpressionAttributeValues: {
      ":quizId": quizId,
    },
  };

  try {
    const result = await db.query(params);
    const questions = result.Items;

    return sendResponse(200, questions);
  } catch (error) {
    console.error("Error retrieving questions:", error);
    return sendError(500, { error: "Could not retrieve questions" });
  }
};

export const handler = middy(getQuestionsByQuizId)
  .use(httpErrorHandler())
  .use(authMiddleware());
