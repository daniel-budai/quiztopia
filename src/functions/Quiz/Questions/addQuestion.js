import { db } from "../../../services/database/dynamodb.js";
import createError from "http-errors";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import authMiddleware from "../../../middlewares/auth/authMiddleware.js";
import { v4 as uuidv4 } from "uuid";

const addQuestion = async (event) => {
  const { quizId } = event.pathParameters;
  const { question, answer, latitude, longitude } = event.body;
  const questionId = uuidv4();

  const params = {
    TableName: process.env.QUESTIONS_TABLE,
    Item: {
      questionId,
      quizId,
      question,
      answer,
      latitude,
      longitude,
    },
  };

  try {
    await db.put(params);
  } catch (error) {
    console.error("Error adding question:", error);
    throw new createError.InternalServerError("Could not add question");
  }

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Question added successfully",
      questionId,
    }),
  };
};

export const handler = middy(addQuestion)
  .use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(authMiddleware());
