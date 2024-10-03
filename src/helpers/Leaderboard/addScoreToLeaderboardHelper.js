import { db } from "../../services/database/dynamodb.js";

export const addScoreToLeaderboard = async (
  quizId,
  accountId,
  username,
  answers
) => {
  try {
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
      throw new Error(
        `Incorrect number of answers. Expected ${questions.length}, but got ${answers.length}.`
      );
    }

    let score = 0;
    questions.forEach((question) => {
      const userAnswer = answers.find(
        (a) =>
          a.answer.toLowerCase().trim() === question.answer.toLowerCase().trim()
      );

      if (userAnswer) {
        const latitudeMatches =
          Math.abs(
            parseFloat(question.latitude) - parseFloat(userAnswer.latitude)
          ) < 0.0001;
        const longitudeMatches =
          Math.abs(
            parseFloat(question.longitude) - parseFloat(userAnswer.longitude)
          ) < 0.0001;

        if (latitudeMatches && longitudeMatches) {
          score += 1;
        }
      }
    });

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

    return {
      score,
      totalQuestions: questions.length,
    };
  } catch (error) {
    console.error("Error adding score to leaderboard:", error);
    throw error;
  }
};
