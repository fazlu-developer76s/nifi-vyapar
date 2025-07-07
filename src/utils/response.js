import { encryp } from "./cryptoHelper.js";

// function successResponse(res, message, data = {}, statusCode = 200) {
//    res.status(statusCode).json({
//     success: true,
//     message,
//     data,
//   });
// }
function successResponse(res, message, data = {}, statusCode = 200) {
  const response = {
    success: true,
    message,
    data,
  };
  const encrypted = encryp(response);
  if (!encrypted) {
    return res.status(500).json({
      success: false,
      message: "Encryption failed",
    });
  }
  return res.status(statusCode).json({
    encrypted, // sending only encrypted response
  });
}


// function errorResponse(res, message, statusCode = 400, errors = {}) {
//   return res.status(statusCode).json({
//     success: false,
//     message,
//     errors,
//   });
// }

function errorResponse(res, message, statusCode = 400, errors = {}) {
  const response = {
    success: false,
    message,
    errors,
  };
  const encrypted = encryp(response);
  if (!encrypted) {
    return res.status(500).json({
      success: false,
      message: "Encryption failed",
    });
  }
  return res.status(statusCode).json({
    encrypted, // only sending encrypted version
  });
}

export { successResponse, errorResponse };
