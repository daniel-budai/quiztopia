import { createQuiz } from "../../../helpers/Quiz/createQuizHelper.js";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { inputValidator } from "../../../middlewares/validation/inputValidator.js";
import { createQuizSchema } from "../../../schemas/Quiz/createQuizSchema.js";
import authMiddleware from "../../../middlewares/auth/authMiddleware.js";
import {
  sendResponse,
  sendError,
} from "../../../utils/responses/responseHandlers.js";

const createQuizHandler = async (event) => {
  const { title } = event.body;
  const { accountId, username } = event.user;

  try {
    const quizId = await createQuiz(title, accountId, username);
    return sendResponse(201, {
      message: "Quiz created successfully",
      quizId,
    });
  } catch (error) {
    console.error("Error in createQuizHandler:", error);
    return sendError(500, { error: "Could not create quiz" });
  }
};

export const handler = middy(createQuizHandler)
  .use(jsonBodyParser())
  .use(authMiddleware())
  .use(inputValidator(createQuizSchema));
