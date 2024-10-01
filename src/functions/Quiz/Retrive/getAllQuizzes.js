import { db } from "../../../services/database/dynamodb.js";
import createError from "http-errors";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import {
  sendResponse,
  sendError,
} from "../../../utils/responses/responseHandlers.js";

const getAllQuizzes = async (event) => {
  const quizParams = {
    TableName: process.env.QUIZZES_TABLE,
  };

  try {
    const quizResult = await db.scan(quizParams);
    const quizzes = quizResult.Items;

    const accountIds = quizzes.map((quiz) => quiz.accountId);
    const uniqueAccountIds = [...new Set(accountIds)];

    const accountPromises = uniqueAccountIds.map((accountId) => {
      const accountParams = {
        TableName: process.env.ACCOUNTS_TABLE,
        Key: { accountId },
      };
      return db.get(accountParams);
    });

    const accountResults = await Promise.all(accountPromises);
    const accounts = accountResults.map((result) => result.Item);

    const quizzesWithUsernames = quizzes.map((quiz) => {
      const account = accounts.find((acc) => acc.accountId === quiz.accountId);
      return {
        title: quiz.title,
        username: account ? account.username : null,
      };
    });

    return sendResponse(200, quizzesWithUsernames);
  } catch (error) {
    console.error("Error retrieving quizzes:", error);
    return sendError(500, { error: "Could not retrieve quizzes" });
  }
};

export const handler = middy(getAllQuizzes).use(httpErrorHandler());
