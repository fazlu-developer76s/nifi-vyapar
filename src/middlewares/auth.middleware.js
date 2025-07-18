import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/response.js";
import { Token } from "../models/token.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key_here";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Check if header is present and formatted properly
  // if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //   return errorResponse(res, "Authorization header is missing or invalid", 401);
  // }

  // 2. Extract token from header
   const token = authHeader.split(" ")[1];
 
  //  console.log(authHeader,"header")
  try {
    // 3. Decode and verify JWT
    const decoded = jwt.verify(authHeader, JWT_SECRET);
    // 4. Check token existence and status in DB
    const token_status = await Token.findOne({
      token: authHeader, // or use just `token` if DB stores only the token part
      userID: decoded.id,
      token_status: "active"
    });
    if (!token_status) {
      return errorResponse(res, "Token is not valid or has expired", 401);
    }

    // 5. Attach user data to request
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    errorResponse(res, "Token verification failed", 401);
  }
};

export default verifyToken;
