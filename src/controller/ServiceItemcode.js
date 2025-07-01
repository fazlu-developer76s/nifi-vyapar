import ServiceItemCode from "../models/ServiceCodeItem.js"
import { decryptData, encryptData } from "../lib/encrypt.js";
import { errorResponse, successResponse } from "../lib/reply.js";


const generateUniqueCode = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();  
  };
  

export const assignServiceCodeItem = async (req, res) => {
    try {
      let generatedCode;
      let isDuplicate = true;
  
      // Keep generating until a unique code is found
      while (isDuplicate) {
        generatedCode = generateUniqueCode();
  
        const existingCode = await ServiceItemCode.findOne({
          code: generatedCode
        });
  
        if (!existingCode) {
          isDuplicate = false;
        }
      }
  
      // Finally return the unique generated code
      return res.status(200).json(successResponse(200, "Sale code generated", null, true, {
        code: generatedCode
      }));
    } catch (error) {
      console.error("Assign SaleCodeItem Error:", error);
      return res.status(500).json(errorResponse(500, error.message, false));
    }
  };
