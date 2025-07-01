import Unit from "../models/Unit.js";
import { decryptData, encryptData } from "../lib/encrypt.js";
import { errorResponse, successResponse } from "../lib/reply.js";


export const createUnit = async (req, res) => {
    try {
      const { unitName, sortName } = req.decryptedBody;
  
      const encryptedUnitName = encryptData(unitName).encryptedData;
      const encryptedSortName = encryptData(sortName).encryptedData;
  
      const existing = await Unit.findOne({
        unitName: encryptedUnitName,
        sortName: encryptedSortName,
      });
  
      if (existing) {
        return res
          .status(400)
          .json(errorResponse(400, "Unit already exists", false));
      }
  
      const newUnit = new Unit({
        unitName: encryptedUnitName,
        sortName: encryptedSortName,
      });
  
      await newUnit.save();
  
      return res
        .status(201)
        .json(
          successResponse(201,  "Unit created successfully", "", true,newUnit)
        );
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json(errorResponse(500, "Something went wrong", false));
    }
  };
  
// Get All Units
export const getAllUnits = async (req, res) => {
  try {
    const units = await Unit.find();
    const decryptedUnits = units.map((u) => ({
      _id: u._id,
      unitName: decryptData(u.unitName),
      sortName: decryptData(u.sortName),
    }));

    return res
      .status(200)
      .json(
        successResponse(
          200,
          
          "Units fetched successfully",
          "",
          true,
          decryptedUnits,
        )
      );
  } catch (err) {
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false));
  }
};


export const updateUnit = async (req, res) => {
    try {
      const unitId = req.params.id || req.body.id || req.query.id;
  
      if (!unitId || typeof unitId !== 'string') {
        return res
          .status(400)
          .json(errorResponse(400, "Invalid or missing unit ID", false));
      }
  
      const { unitName, sortName } = req.decryptedBody;
  
      const encryptedUnitName = encryptData(unitName).encryptedData;
      const encryptedSortName = encryptData(sortName).encryptedData;
  
      // Check for duplicate (excluding the current unit)
      const existing = await Unit.findOne({
        _id: { $ne: unitId },
        unitName: encryptedUnitName,
        sortName: encryptedSortName,
      });
  
      if (existing) {
        return res
          .status(400)
          .json(errorResponse(400, "Unit already exists", false));
      }
  
      const updatedUnit = await Unit.findByIdAndUpdate(
        unitId,
        {
          unitName: encryptedUnitName,
          sortName: encryptedSortName,
        },
        { new: true }
      );
  
      if (!updatedUnit) {
        return res
          .status(404)
          .json(errorResponse(404, "Unit not found", false));
      }
  
      return res
        .status(200)
        .json(
          successResponse(200, "Unit updated successfully", "", true, updatedUnit)
        );
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json(errorResponse(500, "Something went wrong", false));
    }
  };
  
// Delete Unit
export const deleteUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Unit.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json(errorResponse(404, "Unit not found", false));
    }

    return res
      .status(200)
      .json(
        successResponse(200, deleted, "Unit deleted successfully", "", true)
      );
  } catch (err) {
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false));
  }
};
