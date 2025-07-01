import ItemCode from '../models/itemCode.js';
import { errorResponse, successResponse } from "../lib/reply.js";
import {generateUniqueCode} from '../helpers/codeGenerator.js'

export const assignCode = async (req, res) => {
  try {
    let generatedCode;
    let isDuplicate = true;

    while (isDuplicate) {
      generatedCode = generateUniqueCode();

      const existingCode = await ItemCode.findOne({
        code: generatedCode
      });

      if (!existingCode) {
        isDuplicate = false;
      }
    }

   
    return res.status(200).json(successResponse(200, "code generated", null, true, {
      code: generatedCode
    }));
  } catch (error) {
    console.error("Assign CodeItem Error:", error);
    return res.status(500).json(errorResponse(500, error.message, false));
  }
};


