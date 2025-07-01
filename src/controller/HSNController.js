import HSN from "../models/HSN.js";
import { errorResponse, successResponse } from '../lib/reply.js'; // Correcting the import
import { encryptData, decryptData } from '../lib/encrypt.js'; // Correcting the import

export const createHSN = async (req, res) => {
  try {
    const user = req.User
    const { HSNcode, description, status } = req.decryptedBody;

    if (!HSNcode || !description) {
      return res.status(400).json(errorResponse(400, "", "HSNcode and description are required"));
    }
     const encryptedHSNcode = encryptData(HSNcode)
    const encrypteddescription = encryptData(description)
    const existing = await HSN.findOne({ HSNcode:encryptedHSNcode,userId:user });
    if (existing) {
      return res.status(400).json(errorResponse(400, "", "HSNcode already exists"));
    }


    const newHSN = new HSN({
      HSNcode:encryptedHSNcode,
      description:encrypteddescription,
      status: status || "active",
      userId:user
    });

    await newHSN.save();

    return res.status(201).json(successResponse(201, "", "HSN created successfully"));
  } catch (error) {
    console.error("Error in createHSN:", error.message);
    return res.status(500).json(errorResponse(500, "", "Internal Server Error"));
  }
};

export const updateHSN = async (req, res) => {
  try {
    const user = req.user
    const { id } = req.params;
    const { HSNcode, description, status } = req.decryptedBody;

    const hsn = await HSN.findById(id);
    if (!hsn) {
      return res.status(404).json(errorResponse(404, "", "HSN not found"));
    }

    // If HSNcode is being updated, check for duplicate (excluding current record)
    if (HSNcode) {
      const encryptedHSNcode = encryptData(HSNcode);
      const existing = await HSN.findOne({ HSNcode: encryptedHSNcode, _id: { $ne: id },userId:user });

      if (existing) {
        return res.status(400).json(errorResponse(400, "", "HSNcode already exists"));
      }

      hsn.HSNcode = encryptedHSNcode;
    }

    if (description) {
      hsn.description = encryptData(description);
    }

    if (status) {
      hsn.status = status;
    }

    await hsn.save();

    return res.status(200).json(successResponse(200, "", "HSN updated successfully"));
  } catch (error) {
    console.error("Error in updateHSN:", error.message);
    return res.status(500).json(errorResponse(500, "", "Internal Server Error"));
  }
};

export const getAllHSN = async (req, res) => {
  try {
    const user = req.user
    const hsnList = await HSN.find({userId:user});

    const decryptedList = hsnList.map((hsn) => ({
      _id: hsn._id,
      HSNcode: hsn.HSNcode ? decryptData(hsn.HSNcode) : null,
      description: hsn.description ? decryptData(hsn.description) : null,
      status: hsn.status,
    }));

    return res.status(200).json(successResponse(200, decryptedList, "HSN list fetched successfully"));
  } catch (error) {
    console.error("Error in getAllHSN:", error.message);
    return res.status(500).json(errorResponse(500, "", "Internal Server Error"));
  }
};

export const deleteHSN = async (req, res) => {
  try {
    const { id } = req.params;

    const hsn = await HSN.findById(id);
    if (!hsn) {
      return res.status(404).json(errorResponse(404, "", "HSN not found"));
    }

    await HSN.findByIdAndDelete(id);

    return res.status(200).json(successResponse(200, "", "HSN deleted successfully"));
  } catch (error) {
    console.error("Error in deleteHSN:", error.message);
    return res.status(500).json(errorResponse(500, "", "Internal Server Error"));
  }
};
