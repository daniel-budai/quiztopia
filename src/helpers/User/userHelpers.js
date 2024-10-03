import { db } from "../../services/database/dynamodb.js";
import { v4 as uuidv4 } from "uuid";

export const createUser = async (username, hashedPassword) => {
  // First, check if the username already exists
  const existingUser = await getUserByUsername(username);
  if (existingUser) {
    throw new Error("Username already exists");
  }

  const accountId = uuidv4();
  const params = {
    TableName: process.env.ACCOUNTS_TABLE,
    Item: {
      accountId,
      username,
      password: hashedPassword,
    },
  };

  try {
    await db.put(params);
    return accountId;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Could not create user");
  }
};

export const getUserByUsername = async (username) => {
  const params = {
    TableName: process.env.ACCOUNTS_TABLE,
    IndexName: "UsernameIndex",
    KeyConditionExpression: "username = :username",
    ExpressionAttributeValues: {
      ":username": username,
    },
  };

  const result = await db.query(params);
  return result.Items[0];
};

export const getUserById = async (accountId) => {
  const params = {
    TableName: process.env.ACCOUNTS_TABLE,
    Key: { accountId },
  };

  const result = await db.get(params);
  return result.Item;
};
