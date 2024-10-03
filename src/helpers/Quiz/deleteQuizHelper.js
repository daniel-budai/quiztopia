import { db } from "../../services/database/dynamodb.js";

export const deleteQuiz = async (quizId, accountId) => {
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
      throw new Error(
        "Quiz not found or you don't have permission to delete it"
      );
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

    return true;
  } catch (error) {
    console.error("Error deleting quiz:", error);
    throw error;
  }
};
