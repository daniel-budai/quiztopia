import { db } from "../../services/database/dynamodb.js";

export const getQuestionsByQuizId = async (quizId) => {
  const params = {
    TableName: process.env.QUESTIONS_TABLE,
    IndexName: "QuizIdIndex",
    KeyConditionExpression: "quizId = :quizId",
    ExpressionAttributeValues: {
      ":quizId": quizId,
    },
  };

  try {
    const result = await db.query(params);
    return result.Items;
  } catch (error) {
    console.error("Error retrieving questions:", error);
    throw new Error("Could not retrieve questions");
  }
};
