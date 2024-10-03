import { getAllQuizzes } from "../../../helpers/Quiz/getAllQuizHelper.js";
import middy from "@middy/core";
import {
  sendResponse,
  sendError,
} from "../../../utils/responses/responseHandlers.js";

const getAllQuizzesHandler = async (event) => {
  try {
    const quizzes = await getAllQuizzes();
    return sendResponse(200, quizzes);
  } catch (error) {
    console.error("Error in getAllQuizzesHandler:", error);
    return sendError(500, { error: "Could not retrieve quizzes" });
  }
};

export const handler = middy(getAllQuizzesHandler);
