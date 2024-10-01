import { db } from "../../../services/database/dynamodb.js";
import createError from "http-errors";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import authMiddleware from "../../../middlewares/auth/authMiddleware.js";

const getQuestionsByQuizId = async (event) => {
  const params = {
    TableName: process.env.QUESTIONS_TABLE,
  };

  console.log("Scan params:", params);

  try {
    const result = await db.scan(params);
    const questions = result.Items;

    return {
      statusCode: 200,
      body: JSON.stringify(questions),
    };
  } catch (error) {
    console.error("Error retrieving questions:", error);
    throw new createError.InternalServerError("Could not retrieve questions");
  }
};

export const handler = middy(getQuestionsByQuizId)
  .use(httpErrorHandler())
  .use(authMiddleware());
