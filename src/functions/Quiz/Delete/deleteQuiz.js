import { db } from "../../../services/database/dynamodb.js";
import middy from "@middy/core";
import { inputValidator } from "../../../middlewares/validation/inputValidator.js";
import { deleteQuizSchema } from "../../../schemas/Quiz/deleteQuizSchema.js";
import authMiddleware from "../../../middlewares/auth/authMiddleware.js";
import {
  sendResponse,
  sendError,
} from "../../../utils/responses/responseHandlers.js";

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
      return sendError(404, {
        error: "Quiz not found or you don't have permission to delete it",
      });
    }

    const deleteParams = {
      TableName: process.env.QUIZZES_TABLE,
      Key: {
        quizId,
        accountId,
      },
    };

    await db.delete(deleteParams);

    const queryParams = {
      TableName: process.env.QUESTIONS_TABLE,
      IndexName: "QuizIdIndex",
      KeyConditionExpression: "quizId = :quizId",
      ExpressionAttributeValues: {
        ":quizId": quizId,
      },
    };

    const questions = await db.query(queryParams);

    const deletePromises = questions.Items.map((question) =>
      db.delete({
        TableName: process.env.QUESTIONS_TABLE,
        Key: { questionId: question.questionId, quizId: question.quizId },
      })
    );

    await Promise.all(deletePromises);

    return sendResponse(200, {
      message: "Quiz and associated questions deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return sendError(500, {
      error: "Could not delete quiz",
    });
  }
};

export const handler = middy(deleteQuiz)
  .use(authMiddleware())
  .use(inputValidator(deleteQuizSchema));
