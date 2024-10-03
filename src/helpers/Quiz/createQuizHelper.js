import { db } from "../../services/database/dynamodb.js";
import { v4 as uuidv4 } from "uuid";

export const createQuiz = async (title, accountId, username) => {
  const quizId = uuidv4();
  const params = {
    TableName: process.env.QUIZZES_TABLE,
    Item: {
      quizId,
      accountId,
      username,
      title,
      createdAt: new Date().toISOString(),
    },
  };

  try {
    await db.put(params);
    return quizId;
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw new Error("Could not create quiz");
  }
};
