import { db } from "../../../services/database/dynamodb.js";
import createError from "http-errors";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import authMiddleware from "../../../middlewares/auth/authMiddleware.js";

const deleteQuiz = async (event) => {
  const { quizId } = event.pathParameters;
  const { accountId } = event.user;

  try {
    const getParams = {
      TableName: process.env.QUIZZES_TABLE,
      Key: {
        quizId,
        accountId,
      },
    };

    const result = await db.get(getParams);

    if (!result.Item) {
      throw new createError.NotFound(
        "Quiz not found or you don't have permission to delete it"
      );
    }

    const deleteParams = {
      TableName: process.env.QUIZZES_TABLE,
      Key: {
        quizId,
        accountId,
      },
    };

    await db.delete(deleteParams);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Quiz deleted successfully" }),
    };
  } catch (error) {
    console.error("Error deleting quiz:", error);
    throw new createError.InternalServerError("Could not delete quiz");
  }
};

export const handler = middy(deleteQuiz)
  .use(httpErrorHandler())
  .use(authMiddleware());
