import middy from "@middy/core";
import createError from "http-errors";
import { verifyToken } from "../utils/jwt/jwtUtils";

const authMiddleware = () => {
  return {
    before: async (handler) => {
      const { headers } = handler.event;
      const authToken = headers.Authorization || headers.authorization;

      if (!authToken) {
        throw new createError.Unauthorized("Unauthorized");
      }

      try {
        const token = authToken.split(" ")[1];
        const decoded = verifyToken(token);
        handler.event.user = decoded;
      } catch (error) {
        console.error("Token verification failed:", error.message);
        throw new createError.Unauthorized("Unauthorized");
      }
    },
  };
};

export default authMiddleware;
