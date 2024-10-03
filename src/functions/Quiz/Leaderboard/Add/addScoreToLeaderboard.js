import { addScoreToLeaderboard } from "../../../../helpers/Leaderboard/addScoreToLeaderboardHelper.js";
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

const addScoreToLeaderboardHandler = async (event) => {
  const { quizId } = event.pathParameters;
  const { answers } = event.body;
  const { accountId, username } = event.user;

  if (!answers || !Array.isArray(answers)) {
    return sendError(400, {
      error: "Answers must be provided as an array of objects",
    });
  }

  try {
    console.log("Received answers:", JSON.stringify(answers, null, 2));
    const result = await addScoreToLeaderboard(
      quizId,
      accountId,
      username,
      answers
    );
    console.log("Score result:", JSON.stringify(result, null, 2));
    return sendResponse(200, {
      message: "Quiz completed",
      score: result.score,
      totalQuestions: result.totalQuestions,
    });
  } catch (error) {
    console.error("Error in addScoreToLeaderboardHandler:", error);
    if (error.message.startsWith("Incorrect number of answers")) {
      return sendError(400, { error: error.message });
    }
    return sendError(500, { error: "Could not complete the quiz" });
  }
};

export const handler = middy(addScoreToLeaderboardHandler)
  .use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(authMiddleware())
  .use(inputValidator(addScoreSchema));
