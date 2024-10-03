import { db } from "../../services/database/dynamodb.js";
import { v4 as uuidv4 } from "uuid";

export const addQuestion = async (quizId, questionData, accountId) => {
  const quizParams = {
    TableName: process.env.QUIZZES_TABLE,
    Key: {
      quizId,
      accountId,
    },
  };

  try {
    const quizResult = await db.get(quizParams);
    if (!quizResult.Item) {
      throw new Error(
        "Quiz not found or you don't have permission to add questions to it"
      );
    }

    const questionId = uuidv4();
    const params = {
      TableName: process.env.QUESTIONS_TABLE,
      Item: {
        questionId,
        quizId,
        ...questionData,
        createdAt: new Date().toISOString(),
      },
    };

    await db.put(params);
    return questionId;
  } catch (error) {
    console.error("Error adding question:", error);
    throw error;
  }
};
