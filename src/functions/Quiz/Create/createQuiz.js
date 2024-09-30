import { db } from "../../../services/database/dynamodb.js";
import { v4 as uuidv4 } from "uuid";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import authMiddleware from "../../../middlewares/auth/authMiddleware.js";

const createQuiz = async (event) => {
  const { title } = event.body;
  const accountId = event.user.accountId;

  if (!title || !accountId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Title and account ID are required" }),
    };
  }

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

  await db.put(params);

  return {
    statusCode: 201,
    body: JSON.stringify({ message: "Quiz created successfully", quizId }),
  };
};

export const handler = middy(createQuiz)
  .use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(authMiddleware());
