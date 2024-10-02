import { db } from "../../../../services/database/dynamodb.js";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import authMiddleware from "../../../../middlewares/auth/authMiddleware.js";
import {
  sendResponse,
  sendError,
} from "../../../../utils/responses/responseHandlers.js";
import { inputValidator } from "../../../../middlewares/validation/inputValidator.js";
import { addScoreSchema } from "../../../../schemas/Quiz/addScoreSchema.js";

const addScoreToLeaderboard = async (event) => {
  const { quizId } = event.pathParameters;
  const { answers } = event.body;
  const { accountId, username } = event.user;

  if (!answers || !Array.isArray(answers)) {
    return sendError(400, {
      error: "Answers must be provided as an array of objects",
    });
  }

  try {
    // Fetch questions for the quiz
    const questionsParams = {
      TableName: process.env.QUESTIONS_TABLE,
      IndexName: "QuizIdIndex",
      KeyConditionExpression: "quizId = :quizId",
      ExpressionAttributeValues: {
        ":quizId": quizId,
      },
    };

    const questionsResult = await db.query(questionsParams);
    const questions = questionsResult.Items;

    if (answers.length !== questions.length) {
      return sendError(400, {
        error: `Incorrect number of answers. Expected ${questions.length}, but got ${answers.length}.`,
      });
    }

    // Calculate score
    let score = 0;
    questions.forEach((question, index) => {
      const userAnswer = answers[index];
      if (
        question.answer.toLowerCase() === userAnswer.answer.toLowerCase() &&
        parseFloat(question.latitude) === parseFloat(userAnswer.latitude) &&
        parseFloat(question.longitude) === parseFloat(userAnswer.longitude)
      ) {
        score += 1;
      }
    });

    // Update leaderboard
    const leaderboardParams = {
      TableName: process.env.LEADERBOARD_TABLE,
      Item: {
        quizId,
        accountId,
        username,
        score,
        playedAt: new Date().toISOString(),
      },
    };

    await db.put(leaderboardParams);

    return sendResponse(200, {
      message: "Quiz completed",
      score,
      totalQuestions: questions.length,
    });
  } catch (error) {
    console.error("Error playing quiz:", error);
    return sendError(500, { error: "Could not complete the quiz" });
  }
};

export const handler = middy(addScoreToLeaderboard)
  .use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(authMiddleware())
  .use(inputValidator(addScoreSchema));
