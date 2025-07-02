import GlobalLog from "../models/GlobalLog.js";

/**
 * Logs an action in the GlobalLog collection
 *
 * @param {Object} params
 * @param {String} params.endpoint - e.g., "/api/user/create"
 * @param {String} params.method - "POST" | "PUT" | "DELETE"
 * @param {String} params.action - "CREATE" | "UPDATE" | "DELETE" | "STATUS UPDATE" | "PAYMENT" | "LOGIN" | "TRANSFER"
 * @param {String|ObjectId} [params.performedBy] - User ID (optional)
 * @param {Object} [params.dataBefore] - Data before change (optional)
 * @param {Object} [params.dataAfter] - Data after change (optional)
 * @param {String} [params.message] - Any message or note (optional)
 */
export const logAction = async ({
  endpoint,
  method,
  action,
  userId = null,
  dataBefore = null,
  dataAfter = null,
  message = "",
}) => {
  try {
    const logEntry = new GlobalLog({
      endpoint,
      method,
      action,
      userId,
      dataBefore,
      dataAfter,
      message,
    });

    await logEntry.save();
  } catch (error) {
    console.error("GlobalLog Error:", error.message);
    // You might want to silently ignore or store logs for debugging
  }
};
