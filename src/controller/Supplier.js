import { decryptData, encryptData } from "../lib/encrypt.js";
import { errorResponse, successResponse } from "../lib/reply.js";
import Supplier from "../models/Supplier.js";

export const createSupplier = async (req, res) => {
  try {
    const user = req.user;
    const {
      supplierName,
      gstIn,
      phoneNumber,
      gstType,
      panNo,
      emailId,
      address,
      status,
    } = req.decryptedBody;

    // Validate GSTIN format
    const gstInRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (gstIn && !gstInRegex.test(gstIn)) {
      return res
        .status(400)
        .json(errorResponse(400, "Invalid GSTIN format", false));
    }

    // Check for duplicate phone number
    if (phoneNumber) {
      const encryptedPhone = encryptData(phoneNumber)?.encryptedData;
      const existingSupplier = await Supplier.findOne({
        phoneNumber: encryptedPhone,
        userId: user,
      });

      if (existingSupplier) {
        return res
          .status(400)
          .json(errorResponse(400, "Phone number already exists", false));
      }
    }

    const normalizedGstType = gstType
      ?.replace(/\s+/g, " ")
      ?.replace(/[–—−]/g, "-")
      ?.trim();

    const finalStatus = status || "active";

    const encryptedData = {
      userId: user,
      supplierName: encryptData(supplierName)?.encryptedData,
      gstIn: encryptData(gstIn)?.encryptedData,
      panNo: encryptData(panNo)?.encryptedData,
      phoneNumber: encryptData(phoneNumber)?.encryptedData,
      gstType: normalizedGstType,
      emailId: encryptData(emailId)?.encryptedData,
      address: {
        // billingAddress: encryptData(address?.billingAddress)?.encryptedData,
        // shippingAddress: encryptData(address?.shippingAddress)?.encryptedData,
        state: address?.state,
      },
      status: finalStatus,
    };

    const supplier = new Supplier(encryptedData);
    await supplier.save();

    return res
      .status(200)
      .json(successResponse(200, "Supplier created successfully", "", true));
  } catch (error) {
    console.error("Create Supplier Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false));
  }
};

export const getAllSupplier = async (req, res) => {
  try {
    const user = req.user;
    const Suppliers = await Supplier.find({ userId: user });

    const decryptedSupplier = Suppliers.map((supplier) => ({
      _id: supplier._id,
      supplierName: supplier.supplierName
        ? decryptData(supplier.supplierName)
        : null,
      gstIn: supplier.gstIn ? decryptData(supplier.gstIn) : null,
      phoneNumber: supplier.phoneNumber
        ? decryptData(supplier.phoneNumber)
        : null,
      gstType: supplier.gstType ?? null,
      panNo: supplier.panNo ? decryptData(supplier.panNo) : null,
      emailId: supplier.emailId ? decryptData(supplier.emailId) : null,
      address: {
        // billingAddress: supplier.address?.billingAddress
        //   ? decryptData(supplier.address.billingAddress)
        //   : null,
        // shippingAddress: supplier.address?.shippingAddress
        //   ? decryptData(supplier.address.shippingAddress)
        //   : null,
        state: supplier.address?.state ?? null,
      },
      status: supplier.status || "inactive",
      createdAt: supplier.createdAt,
      updatedAt: supplier.updatedAt,
    }));
    return res
      .status(200)
      .json(
        successResponse(
          200,
          "Supplier fetched successfully",
          "",
          true,
          decryptedSupplier
        )
      );
  } catch (error) {
    console.log("Get Supplier Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false, error.message));
  }
};

export const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      supplierName,
      gstIn,
      panNo,
      phoneNumber,
      gstType,
      emailId,
      address,
      status,
    } = req.decryptedBody;

    const gstInRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (gstIn && !gstInRegex.test(gstIn)) {
      return res
        .status(400)
        .json(errorResponse(400, "Invalid GSTIN format", false));
    }

    const encryptedPhone = encryptData(phoneNumber)?.encryptedData;

    // Optional: Check for duplicate phone number
    // const existingSupplier = await Supplier.findOne({
    //   phoneNumber: encryptedPhone,
    //   _id: { $ne: id },
    // });
    // if (existingSupplier) {
    //   return res
    //     .status(400)
    //     .json(errorResponse(400, "Phone number already exists", false));
    // }

    const normalizedGstType = gstType
      ?.replace(/\s+/g, " ")
      ?.replace(/[–—−]/g, "-")
      ?.trim();

    const encryptedData = {
      supplierName: encryptData(supplierName)?.encryptedData,
      gstIn: encryptData(gstIn)?.encryptedData,
      panNo: encryptData(panNo)?.encryptedData,
      phoneNumber: encryptedPhone,
      gstType: normalizedGstType,
      emailId: encryptData(emailId)?.encryptedData,
      address: {
        state: address?.state,
      },
      status: status,
    };

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      id,
      encryptedData,
      {
        new: true,
      }
    );

    if (!updatedSupplier) {
      return res
        .status(404)
        .json(errorResponse(404, "Supplier not found", false));
    }

    return res
      .status(200)
      .json(successResponse(200, "Supplier updated successfully", "", true));
  } catch (err) {
    console.error("Update Supplier Error:", err);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false));
  }
};
