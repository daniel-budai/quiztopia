import middy from "@middy/core";
import createError from "http-errors";
import { verifyToken } from "../../utils/jwt/tokenUtils.js";
import { db } from "../../services/database/dynamodb.js";

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

        const params = {
          TableName: process.env.ACCOUNTS_TABLE,
          Key: { accountId: decoded.accountId },
        };
        const result = await db.get(params);

        if (!result.Item) {
          throw new createError.Unauthorized("User not found");
        }

        handler.event.user = {
          accountId: decoded.accountId,
          username: result.Item.username,
        };
      } catch (error) {
        console.error("Token verification failed:", error.message);
        throw new createError.Unauthorized("Unauthorized");
      }
    },
  };
};

export default authMiddleware;
