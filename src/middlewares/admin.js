import jwt from "jsonwebtoken";
import User from "../models/User.js"; // adjust if you have a different admin model
import { errorResponse } from "../lib/reply.js";
import UserToken from "../models/UserToken.js";
import { decryptData } from "../lib/encrypt.js";


const adminAuthMiddleware = async (req, res, next) => {
  try {
    const token = 
      req.header("Authorization")?.split(" ")[1] || 
      req.headers.token;

    if (!token) {
      return res.status(401).json(errorResponse(401, "No token provided", false));
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    const user = await User.findById(decoded.id);

    if (!user || user.email !== process.env.Admin_email) {
      return res.status(403).json(errorResponse(403, "Access denied", false));
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Admin Auth Error:", err);
    return res.status(401).json(errorResponse(401, "Invalid token", false));
  }
};



export const adminauthorize = async (req, res, next) => {
  try {
    // Retrieve the token from Authorization header
    const encryptedToken = req.headers.authorization;

    if (!encryptedToken) {
      return res.status(401).json(errorResponse(401, "Authorization token is missing", false));
    }

    // Decrypt the token
    const decryptedToken = decryptData(encryptedToken);
    const jwtToken = Buffer.from(decryptedToken, 'base64').toString('utf8'); // Convert Base64 to original JWT

    // Verify the JWT token
    const decoded = jwt.verify(jwtToken, process.env.TOKEN_SECRET_KEY);

    // Check the token in DB to ensure it's active
    const tokenRecord = await UserToken.findOne({
      token: encryptedToken,
      user_id: decoded.id,
      status: 'active',
    });

    if (!tokenRecord) {
      return res.status(401).json(errorResponse(401, "Invalid or expired token", false));
    }

    // Attach user data to request for further use
    req.user = decoded;
    next(); // Allow the request to proceed to the next route handler
  } catch (err) {
    return res.status(401).json(errorResponse(401, "Unauthorized: Invalid token", false));
  }
};


export default adminAuthMiddleware;
