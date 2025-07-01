import { errorResponse } from "../lib/reply.js";


const AccessAdmin = async (req,res,next) => {
  try {
    const user = req.user;

    if (!user) {
      return res
        .status(403)
        .json(errorResponse(403, "Access denied: No user found", false));
    }

    if (user.email !== process.env.Admin_email) {
      return res
        .status(403)
        .json(errorResponse(403, "Access denied: Not an admin", false));
    }

    next();
  } catch (error) {
    console.error("AccessAdmin error:", error);
    return res
      .status(401)
      .json(errorResponse(401, "Unauthorized: Authentication error", false));
  }
};

export default AccessAdmin;
