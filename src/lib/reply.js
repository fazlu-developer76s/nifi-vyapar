import { encryptData } from "./encrypt.js";

// Success response with encryption
const successResponse = (status, message = 'Success', token, success, data) => {
    const records = encryptData(JSON.stringify({ status, data, message, token, success })).encryptedData;
    return { body: records };
};

// Error response with encryption
// const errorResponse = (status, error, success, message = 'Error occurred') => {
//     const records = encryptData(JSON.stringify({ status, error: error instanceof Error ? error.message : error, message, success })).encryptedData;
//     console.log(status, error)

//     return { body: records };
// };

const errorResponse = (status, error, message = 'Error occurred') => {

    const records = {
      status,
      message,
      error: error instanceof Error ? error.message : error
    };
    return encryptData(JSON.stringify(records)).encryptedData;
    
  };

const handleError = (status, error, message = 'Error occurred') => {
    const records = encryptData(JSON.stringify({ status, message, error: error instanceof Error ? error.message : error })).encryptedData;

    return { body: records };
};


export { successResponse, errorResponse, handleError };