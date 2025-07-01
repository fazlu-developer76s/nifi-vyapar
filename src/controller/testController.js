import { errorResponse, successResponse } from "../lib/reply.js";
export const testAuth = async (req, res) => {
    try {
   
      return res.status(200).json(successResponse(200, "Authorized", req.user, true));
    } catch (error) {
      console.error("Test Auth Error:", error);
      return res.status(500).json(errorResponse(500, error.message, false, "Internal server error"));
    }
  };