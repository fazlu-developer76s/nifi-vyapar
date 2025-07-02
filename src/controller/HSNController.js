import HSN from "../models/HSN.js";
import { errorResponse, successResponse } from '../lib/reply.js'; // Correcting the import
import { encryptData, decryptData } from '../lib/encrypt.js'; // Correcting the import

export const createHSN = async (req, res) => {
  try {
    const user = req.user
    const { HSNcode, description, status } = req.decryptedBody;

    if (!HSNcode || !description) {
      return res.status(400).json(errorResponse(400,  "HSNcode and description are required",false));
    }
     const encryptedHSNcode = encryptData(HSNcode)?.encryptedData
    const encrypteddescription = encryptData(description)?.encryptedData
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

    return res.status(201).json(successResponse(201,  "HSN created successfully",null,true,newHSN));
  } catch (error) {
    console.error("Error in createHSN:", error.message);
    return res.status(500).json(errorResponse(500, "Something went wrong", false));
  }
};

export const updateHSN = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { HSNcode, description, status } = req.decryptedBody;

  const hsn = await HSN.findOne({ _id: id, userId: user });
    if (!hsn) {
      return res.status(404).json(errorResponse(404, "HSN not found", false));
    }

    if (HSNcode) {
      hsn.HSNcode = encryptData(HSNcode)?.encryptedData;
    }

    if (description) {
      hsn.description = encryptData(description)?.encryptedData;
    }

    if (status) {
      hsn.status = status;
    }

    await hsn.save();

    return res
      .status(200)
      .json(successResponse(200, "HSN updated successfully", null, true, hsn));
  } catch (error) {
    console.error("Error in updateHSN:", error.message);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false));
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

    return res.status(200).json(successResponse(200,  "HSN list fetched successfully",null,true,decryptedList));
  } catch (error) {
    console.error("Error in getAllHSN:", error.message);
    return res.status(500).json(errorResponse(500,  "something went wrong",false));
  }
};

export const deleteHSN = async (req, res) => {
  try {
    const { id } = req.params;

    const hsn = await HSN.findById(id);
    if (!hsn) {
      return res.status(404).json(errorResponse(404,  "HSN not found",false));
    }

    await HSN.findByIdAndDelete(id);

    return res.status(200).json(successResponse(200, "HSN deleted successfully",null,true));
  } catch (error) {
    console.error("Error in deleteHSN:", error.message);
    return res.status(500).json(errorResponse(500,  "Something went wrong",false));
  }
};
