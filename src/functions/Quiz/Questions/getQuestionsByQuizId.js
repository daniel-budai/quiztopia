import { getQuestionsByQuizId } from "../../../helpers/Questions/getQuestionsByQuizIdHelper.js";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import authMiddleware from "../../../middlewares/auth/authMiddleware.js";
import {
  sendResponse,
  sendError,
} from "../../../utils/responses/responseHandlers.js";

const getQuestionsByQuizIdHandler = async (event) => {
  const { quizId } = event.pathParameters;

  try {
    const questions = await getQuestionsByQuizId(quizId);
    return sendResponse(200, questions);
  } catch (error) {
    console.error("Error in getQuestionsByQuizIdHandler:", error);
    return sendError(500, { error: "Could not retrieve questions" });
  }
};

export const handler = middy(getQuestionsByQuizIdHandler)
  .use(httpErrorHandler())
  .use(authMiddleware());
