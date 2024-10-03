import { addQuestion } from "../../../helpers/Questions/addQuestionsHelper.js";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { inputValidator } from "../../../middlewares/validation/inputValidator.js";
import { addQuestionSchema } from "../../../schemas/Quiz/addQuestionSchema.js";
import authMiddleware from "../../../middlewares/auth/authMiddleware.js";
import {
  sendResponse,
  sendError,
} from "../../../utils/responses/responseHandlers.js";

const addQuestionHandler = async (event) => {
  const { quizId } = event.pathParameters;
  const { accountId } = event.user;
  const questionData = event.body;

  try {
    const questionId = await addQuestion(quizId, questionData, accountId);
    return sendResponse(201, {
      message: "Question added successfully",
      questionId,
    });
  } catch (error) {
    console.error("Error in addQuestionHandler:", error);
    if (
      error.message ===
      "Quiz not found or you don't have permission to add questions to it"
    ) {
      return sendError(404, { error: error.message });
    }
    return sendError(500, { error: "Could not add question" });
  }
};

export const handler = middy(addQuestionHandler)
  .use(jsonBodyParser())
  .use(authMiddleware())
  .use(inputValidator(addQuestionSchema));
