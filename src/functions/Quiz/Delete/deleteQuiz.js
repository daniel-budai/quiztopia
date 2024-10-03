import { deleteQuiz } from "../../../helpers/Quiz/deleteQuizHelper.js";
import middy from "@middy/core";
import { inputValidator } from "../../../middlewares/validation/inputValidator.js";
import { deleteQuizSchema } from "../../../schemas/Quiz/deleteQuizSchema.js";
import authMiddleware from "../../../middlewares/auth/authMiddleware.js";
import {
  sendResponse,
  sendError,
} from "../../../utils/responses/responseHandlers.js";

const deleteQuizHandler = async (event) => {
  const { quizId } = event.pathParameters;
  const { accountId } = event.user;

  try {
    await deleteQuiz(quizId, accountId);
    return sendResponse(200, {
      message: "Quiz and associated questions deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteQuizHandler:", error);
    if (
      error.message ===
      "Quiz not found or you don't have permission to delete it"
    ) {
      return sendError(404, { error: error.message });
    }
    return sendError(500, { error: "Could not delete quiz" });
  }
};

export const handler = middy(deleteQuizHandler)
  .use(authMiddleware())
  .use(inputValidator(deleteQuizSchema));
