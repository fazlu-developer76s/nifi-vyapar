import { decryptData } from "../lib/encrypt.js";
import IMEI from "../models/IMEI.js";

export const createImei = async (req, res) => {
  try {
    const body = req.body;
    const parsed = JSON.parse(decryptData(body));

    const { productId, imeiNumber, status } = parsed;

    if (!productId || !imeiNumber || !status) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields",
      });
    }

    // Check for duplicate IMEI
    const existing = await IMEI.findOne({ imeiNumber });
    if (existing) {
      return res.status(409).json({
        status: false,
        message: "IMEI number already exists",
      });
    }

    const newImei = new IMEI({ productId, imeiNumber, status });
    await newImei.save();

    return res.status(201).json({
      status: true,
      message: "IMEI created successfully",
      data: newImei,
    });
  } catch (error) {
    console.error("Create IMEI Error:", error);
    return res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};
