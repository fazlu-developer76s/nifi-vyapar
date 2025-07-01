import { decryptData, encryptData } from "../lib/encrypt.js";
import { errorResponse, successResponse } from "../lib/reply.js";
import { Package } from "../models/Package.js";

const createPackage = async (req, res) => {
  try {
    // const { body } = req.body;

    // const decryptedBody = decryptData(body);
    // const parsedBody = JSON.parse(decryptedBody);

    const { packageName, status, price } =req.decryptedBody;

    if (!packageName || status === undefined || price === undefined) {
      return res
        .status(400)
        .json(errorResponse(400, "Missing required fields", false));
    }

    if (status !== true && status !== false) {
      return res
        .status(400)
        .json(
          errorResponse(
            400,
            "Invalid status: only true or false are allowed",
            false
          )
        );
    }

    const encryptedPackageName = encryptData(
      JSON.stringify(packageName)
    )?.encryptedData;
    const encryptedStatus = encryptData(JSON.stringify(status))?.encryptedData;
    const encryptedPrice = encryptData(JSON.stringify(price))?.encryptedData;

    const existingPackage = await Package.findOne({
      packageName: encryptedPackageName,
    });
    if (existingPackage) {
      return res
        .status(400)
        .json(errorResponse(400, "Package already exists", false));
    }

    const newPackage = new Package({
      packageName: encryptedPackageName,
      status: encryptedStatus,
      price: encryptedPrice,
    });

    await newPackage.save();

    return res
      .status(200)
      .json(successResponse(200, "Package created successfully", "", true));
  } catch (error) {
    console.error("Create package error:", error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false, error.message));
  }
};

const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find().sort({ createdAt: -1 });

    const decryptedPackages = packages.map((pkg) => ({
      _id: pkg._id,
      packageName: JSON.parse(decryptData(pkg.packageName)),
      status: JSON.parse(decryptData(pkg.status)),
      price: JSON.parse(decryptData(pkg.price)),
      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt,
    }));

    return res
      .status(200)
      .json(
        successResponse(
          200,
          "All packages fetched",
          "",
          true,
          decryptedPackages
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(errorResponse(500, "Server Error", false, error.message));
  }
};

const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    const pkg = await Package.findById(id);
    if (!pkg)
      return res
        .status(404)
        .json(errorResponse(404, "Package not found", false));

    const decrypted = {
      _id: pkg._id,
      packageName: JSON.parse(decryptData(pkg.packageName)),
      status: JSON.parse(decryptData(pkg.status)),
      price: JSON.parse(decryptData(pkg.price)),
      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt,
    };

    return res
      .status(200)
      .json(successResponse(200, "Package fetched", "", true, decrypted));
  } catch (error) {
    return res
      .status(500)
      .json(errorResponse(500, "Server Error", false, error.message));
  }
};

const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    // const { body } = req.body;

    // const decryptedBody = decryptData(body);
    // const parsedBody = JSON.parse(decryptedBody);
    const { packageName, status, price } = req.decryptedBody;

    const encryptedPackageName = encryptData(
      JSON.stringify(packageName)
    )?.encryptedData;
    const encryptedStatus = encryptData(JSON.stringify(status))?.encryptedData;
    const encryptedPrice = encryptData(JSON.stringify(price))?.encryptedData;

    const updated = await Package.findByIdAndUpdate(
      id,
      {
        packageName: encryptedPackageName,
        status: encryptedStatus,
        price: encryptedPrice,
      },
      { new: true }
    );

    if (!updated)
      return res
        .status(404)
        .json(errorResponse(404, "Package not found", false));

    return res
      .status(200)
      .json(successResponse(200, "Package updated", "", true));
  } catch (error) {
    return res
      .status(500)
      .json(errorResponse(500, "Server Error", false, error.message));
  }
};

const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Package.findByIdAndDelete(id);
    if (!deleted)
      return res
        .status(404)
        .json(errorResponse(404, "Package not found", false));

    return res
      .status(200)
      .json(successResponse(200, "Package deleted", "", true));
  } catch (error) {
    return res
      .status(500)
      .json(errorResponse(500, "Server Error", false, error.message));
  }
};

export {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
};
