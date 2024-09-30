import jwt from "jsonwebtoken";

export const generateToken = (accountId) => {
  // Change userId to accountId
  const token = jwt.sign({ accountId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error("Token verification error:", error.message);
    throw new Error("Invalid token");
  }
};
