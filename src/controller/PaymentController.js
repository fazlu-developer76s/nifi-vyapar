import { decryptData } from "../lib/encrypt.js";
import { errorResponse, successResponse } from "../lib/reply.js";
import Paymenttype from "../models/Paymenttype.js";

export const createPaymentType = async (req, res) => {
  try {
    const body = req.body;
    const decrypted = JSON.parse(decryptData(body));

    const { paymentType, status } = decrypted;

    // if (!paymentType || typeof status !== "boolean") {
    //   return res
    //     .status(400)
    //     .json(errorResponse(400, "Missing required fields", false));
    // }

    const existingPaymentType = await Paymenttype.findOne({ paymentType });
    if (existingPaymentType) {
      return res
        .status(409)
        .json(errorResponse(409, "Payment type already exists", false));
    }

    const newPaymentType = new Paymenttype({ paymentType, status });
    await newPaymentType.save();

    return res
      .status(201)
      .json(
        successResponse(
          201,
          "Payment type created successfully",
          true,
          "",
          newPaymentType
        )
      );
  } catch (error) {
    console.error("Create Payment Type Error:", error);
    return res.status(500).json(errorResponse(500, "Server error", false));
  }
};

export const updatePaymnentType = async (req, res) => {
  try {
    const body = req.body;
    const decrypted = JSON.parse(decryptData(body));
    const { id } = req.params;
    const { paymentType, status } = decrypted;
    if (!id) {
      return res
        .status(400)
        .json(errorResponse(400, "Payment type ID is required", false));
    }

    if (!paymentType || typeof status !== "boolean") {
      return res
        .status(400)
        .json(errorResponse(400, "Missing required fields", false));
    }

    const paymentTypeToUpdate = await Paymenttype.findById(id);
    if (!paymentTypeToUpdate) {
      return res
        .status(404)
        .json(errorResponse(404, "Payment type not found", false));
    }

    paymentTypeToUpdate.paymentType = paymentType;
    paymentTypeToUpdate.status = status;
    await paymentTypeToUpdate.save();

    return res
      .status(200)
      .json(
        successResponse(
          200,
          "Payment type updated successfully",
          true,
          "",
          paymentTypeToUpdate
        )
      );
  } catch (error) {
    console.error("Update Payment Type Error:", error);
    return res.status(500).json(errorResponse(500, "Server error", false));
  }
};

export const getPaymentTypes = async (req, res) => {
  try {
    const paymentTypes = await Paymenttype.find();
    if (paymentTypes.length === 0) {
      return res
        .status(404)
        .json(errorResponse(404, "No payment types found", false));
    }
    return res
      .status(200)
      .json(
        successResponse(
          200,
          "Payment types retrieved successfully",
          true,
          "",
          paymentTypes
        )
      );
  } catch (error) {
    console.error("Get Payment Types Error:", error);
    return res.status(500).json(errorResponse(500, "Server error", false));
  }
};
