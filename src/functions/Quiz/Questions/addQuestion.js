import { db } from "../../../services/database/dynamodb.js";
import createError from "http-errors";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import authMiddleware from "../../../middlewares/auth/authMiddleware.js";
import { v4 as uuidv4 } from "uuid";
import {
  sendResponse,
  sendError,
} from "../../../utils/responses/responseHandlers.js";

const addQuestion = async (event) => {
  if (!event.pathParameters || !event.pathParameters.quizId) {
    return sendError(400, { error: "Quiz ID is required" });
  }

  const { quizId } = event.pathParameters;
  const { question, answer, latitude, longitude } = event.body;
  const { accountId, username } = event.user;
  const questionId = uuidv4();

  const params = {
    TableName: process.env.QUESTIONS_TABLE,
    Item: {
      questionId,
      quizId,
      accountId,
      username,
      question,
      answer,
      latitude,
      longitude,
      createdAt: new Date().toISOString(),
    },
  };

  try {
    await db.put(params);
    return sendResponse(201, {
      message: "Question added successfully",
      questionId,
    });
  } catch (error) {
    console.error("Error adding question:", error);
    return sendError(500, { error: "Could not add question" });
  }
};

export const handler = middy(addQuestion)
  .use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(authMiddleware());
