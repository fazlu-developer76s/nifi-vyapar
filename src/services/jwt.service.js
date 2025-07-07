import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Replace this with your own secret key (store in .env for security)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1h";

// Create token
export function generateToken(payload) {
    
  return jwt.sign(payload, JWT_SECRET, { expiresIn:JWT_EXPIRATION });
}

// Verify token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export function generateOTP(length = 6) {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10); // 0-9
  }
  return otp;
}