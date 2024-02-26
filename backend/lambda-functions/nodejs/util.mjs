import jwt from "jsonwebtoken";

export const tokenVerify = (token) => {
  token = token?.replace("Bearer", "")?.trim();
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return { statusCode: 200, user: decoded.user };
    } catch (err) {
      return {
        statusCode: 401,
        error: "Unauthorized!",
      };
    }
  } else {
    return {
      statusCode: 403,
      error: "Token is required",
    };
  }
};
