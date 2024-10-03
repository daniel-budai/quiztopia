import { db } from "../../services/database/dynamodb.js";

export const getLeaderboard = async (quizId) => {
  const params = {
    TableName: process.env.LEADERBOARD_TABLE,
    IndexName: "QuizScoreIndex",
    KeyConditionExpression: "quizId = :quizId",
    ExpressionAttributeValues: {
      ":quizId": quizId,
    },
    ProjectionExpression: "username, score",
    ScanIndexForward: false,
  };

  try {
    const result = await db.query(params);
    return result.Items.map((item) => ({
      username: item.username,
      score: item.score,
    }));
  } catch (error) {
    console.error("Error retrieving leaderboard:", error);
    throw new Error("Could not retrieve leaderboard");
  }
};
