import { db } from "../../../services/database/dynamodb.js";
import { v4 as uuidv4 } from "uuid";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { inputValidator } from "../../../middlewares/validation/inputValidator.js";
import { createQuizSchema } from "../../../schemas/Quiz/createQuizSchema.js";
import authMiddleware from "../../../middlewares/auth/authMiddleware.js";
import {
  sendResponse,
  sendError,
} from "../../../utils/responses/responseHandlers.js";

const createQuiz = async (event) => {
  const { title } = event.body;
  const { accountId } = event.user;

  const quizId = uuidv4();
  const params = {
    TableName: process.env.QUIZZES_TABLE,
    Item: {
      quizId,
      title,
      accountId,
      createdAt: new Date().toISOString(),
    },
  };

  try {
    await db.put(params);
    return sendResponse(201, { message: "Quiz created successfully", quizId });
  } catch (error) {
    console.error("Error creating quiz:", error);
    return sendError(500, { error: "Could not create quiz" });
  }
};

export const handler = middy(createQuiz)
  .use(jsonBodyParser())
  .use(authMiddleware())
  .use(inputValidator(createQuizSchema));
