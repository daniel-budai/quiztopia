import { db } from "../../services/database/dynamodb.js";

export const getAllQuizzes = async () => {
  const params = {
    TableName: process.env.QUIZZES_TABLE,
  };

  try {
    const result = await db.scan(params);
    const quizzes = result.Items;
    const userPromises = quizzes.map((quiz) =>
      db.get({
        TableName: process.env.ACCOUNTS_TABLE,
        Key: { accountId: quiz.accountId },
      })
    );

    const userResults = await Promise.all(userPromises);
    const quizzesWithUsernames = quizzes.map((quiz, index) => ({
      title: quiz.title,
      username: userResults[index].Item
        ? userResults[index].Item.username
        : "Unknown",
      createdAt: quiz.createdAt,
    }));

    return quizzesWithUsernames;
  } catch (error) {
    console.error("Error getting all quizzes:", error);
    throw new Error("Could not retrieve quizzes");
  }
};
