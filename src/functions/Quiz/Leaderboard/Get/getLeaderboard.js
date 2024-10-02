import { db } from "../../../../services/database/dynamodb.js";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import {
  sendResponse,
  sendError,
} from "../../../../utils/responses/responseHandlers.js";

const getQuizLeaderboard = async (event) => {
  const { quizId } = event.pathParameters;

  const params = {
    TableName: process.env.LEADERBOARD_TABLE,
    IndexName: "QuizScoreIndex",
    KeyConditionExpression: "quizId = :quizId",
    ExpressionAttributeValues: {
      ":quizId": quizId,
    },
    ProjectionExpression: "username, score",
    ScanIndexForward: false, // This will sort in descending order (highest score first)
    Limit: 10, // Get top 10 scores
  };

  try {
    const result = await db.query(params);
    const leaderboard = result.Items.map((item) => ({
      username: item.username,
      score: item.score,
    }));

    return sendResponse(200, leaderboard);
  } catch (error) {
    console.error("Error retrieving leaderboard:", error);
    return sendError(500, { error: "Could not retrieve leaderboard" });
  }
};

export const handler = middy(getQuizLeaderboard).use(httpErrorHandler());
