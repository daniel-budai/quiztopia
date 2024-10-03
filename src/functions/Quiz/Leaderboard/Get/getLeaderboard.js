import { getLeaderboard } from "../../../../helpers/Leaderboard/getLeaderboardHelper.js";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import {
  sendResponse,
  sendError,
} from "../../../../utils/responses/responseHandlers.js";

const getLeaderboardHandler = async (event) => {
  const { quizId } = event.pathParameters;

  try {
    const leaderboard = await getLeaderboard(quizId);
    return sendResponse(200, leaderboard);
  } catch (error) {
    console.error("Error in getLeaderboardHandler:", error);
    return sendError(500, { error: "Could not retrieve leaderboard" });
  }
};

export const handler = middy(getLeaderboardHandler).use(httpErrorHandler());
