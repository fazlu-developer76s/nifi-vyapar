import jwt from "jsonwebtoken";


import User from "../models/User.js";

import { decryptData } from "../lib/encrypt.js";
import UserToken from "../models/UserToken.js";
import { errorResponse } from "../lib/reply.js";

const authMiddleware = async (req, res, next) => {
  try {

    const token =
      req.header("Authorization")?.split(" ")[1] ||
      req.headers?.token ||
      req.cookies?.token;
    console.log(token);
    if (!token) {
      return res
        .status(404)
        .json(errorResponse(404, "Unauthorize user", false));
    }
    const decode = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

    const user = await User.findOne({ _id: decode?.id });
 
    if (!user) {
      const errorRes = errorResponse(401, "Invalid User", false);
      return res.status(401).json(errorRes);
    }
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    return res
      .status(503)
      .json(errorResponse(503, "Something went wrong", false));
  }
};

// export const authenticateToken = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization || req.body.token;
//     if (!authHeader) {
//       return res.status(401).json({ message: "No token provided" });
//     }

//     const decryptedToken = decryptData(authHeader);
//     if (!decryptedToken) return res.status(401).json({ message: "Invalid token" });

//     const base64Decoded = Buffer.from(decryptedToken, 'base64').toString('utf-8');

//     const existingToken = await UserToken.findOne({
//       token: authHeader,
//       status: "active"
//     }).populate("user_id");

//     if (!existingToken) {
//       return res.status(403).json({ message: "Unauthorized or token not found" });
//     }

//     const decoded = jwt.verify(base64Decoded, process.env.TOKEN_SECRET_KEY);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     return res.status(403).json({ message: "Invalid or expired token", error: error.message });
//   }
// };

export const authorize = async (req, res, next) => {
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
    req.user = decoded.id;
    next(); // Allow the request to proceed to the next route handler
  } catch (err) {
    return res.status(401).json(errorResponse(401, "Unauthorized: Invalid token", false));
  }
};


// export default authMiddleware;
  
