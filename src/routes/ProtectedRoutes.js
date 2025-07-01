// routes/protectedRoute.js
import express from "express";
import { verifyAuth } from "../middlewares/auth.js";


const protectedrouter = express.Router();

protectedrouter.get("/secure-data", verifyAuth, (req, res) => {
  res.json({ message: `Secure access for user ${req.user.id}` });
});

export default protectedrouter;
