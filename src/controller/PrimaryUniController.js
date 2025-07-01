import PrimaryUnit from "../models/PrimaryUnit.js";
import { errorResponse, successResponse } from "../lib/reply.js";
import { encryptData,decryptData } from "../lib/encrypt.js";


export const getPrimaryUnitById = async (req, res) => {
  try {
    const { body } = req.body;
    const { id } = JSON.parse(decryptData(body));

    const unit = await PrimaryUnit.findById(id);
    if (!unit) return res.status(404).json(errorResponse(404, "Unit not found", false));

    const data = {
      _id: unit._id,
      name: JSON.parse(decryptData(unit.name)),
      createdAt: unit.createdAt,
      updatedAt: unit.updatedAt
    };

    return res.status(200).json(successResponse(200, "Unit found", null, true, data));
  } catch (error) {
    return res.status(500).json(errorResponse(500, error.message, false));
  }
};


export const createPrimaryUnit = async (req, res) => {
  try {
    // const { body } = req.body;
    const user = req.user
    const { name, status } =  req.decryptedBody;

    // Check if 'name' is provided
    if (!name || name.trim() === "") {
      return res.status(400).json(errorResponse(400, "Primary unit name is required", false));
    }

    // Check for duplicate primary unit name
    const units = await PrimaryUnit.find({userId:user});
    const isDuplicate = units.some(unit => {
      const decryptedName =decryptData(unit.name);
      return decryptedName.trim().toLowerCase() === name.trim().toLowerCase();
    });

    if (isDuplicate) {
      return res.status(409).json(errorResponse(409, "Primary unit already exists", false));
    }

    // Set default status if not provided
    const finalStatus = status || "active";

    // Encrypt the name before saving
    const encryptedName = encryptData(name)?.encryptedData;

    // Create new primary unit
    const newUnit = await PrimaryUnit.create({ name: encryptedName, status: finalStatus,userId:user, });

    // Return success response
    return res.status(201).json(
      successResponse(201, "Primary unit created successfully", null, true, {
        id: newUnit._id,
      })
    );
  } catch (error) {
    console.error("Create PrimaryUnit Error:", error);
    return res.status(500).json(errorResponse(500, error.message, false, "Internal server error"));
  }
};

export const updatePrimaryUnit = async (req, res) => {
  try {
    const user = req.user
    const{id}=req.params
    // const { body } = req.body;
    const { name, status } = req.decryptedBody;


    if (!id) {
      return res.status(400).json(errorResponse(400, "Primary unit id is required", false));
    }

    if (name && name.trim() === "") {
      return res.status(400).json(errorResponse(400, "Primary unit name cannot be empty", false));
    }


    if (name) {
      const units = await PrimaryUnit.find({ _id: { $ne: id },userId:user }); 
      const isDuplicate = units.some(unit => {
        const decryptedName = decryptData(unit.name);
        return decryptedName.trim().toLowerCase() === name.trim().toLowerCase();
      });

      if (isDuplicate) {
        return res.status(409).json(errorResponse(409, "Primary unit name already exists", false));
      }
    }


    const updateData = {
      ...(name && { name: encryptData(name)?.encryptedData }),
      ...(status && { status }), 
    };

    const updated = await PrimaryUnit.findByIdAndUpdate(id, updateData, { new: true });

    if (!updated) {
      return res.status(404).json(errorResponse(404, "Primary unit not found", false));
    }

   
    const decryptedUpdated = {
      _id: updated._id,
      name: name ? decryptData(updated.name) : undefined,
      status: updated.status,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };

    return res.status(200).json(
      successResponse(200, "Primary unit updated successfully", null, true, decryptedUpdated)
    );
  } catch (error) {
    console.error("Update PrimaryUnit Error:", error);
    return res.status(500).json(errorResponse(500, error.message, false, "Internal server error"));
  }
};

export const getAllPrimaryUnits = async (req, res) => {
  try {

    const units = await PrimaryUnit.find(); 


    const decryptedUnits = units.map(unit => ({
      _id: unit._id,
      name: decryptData(unit.name),
      status: unit.status,
      createdAt: unit.createdAt,
      updatedAt: unit.updatedAt,
    }));

    return res.status(200).json(
      successResponse(200, "Primary units fetched successfully", null, true, decryptedUnits)
    );
  } catch (error) {
    console.error("Get All PrimaryUnits Error:", error);
    return res.status(500).json(errorResponse(500, error.message, false, "Internal server error"));
  }
};

export const getOurAllPrimaryUnits = async (req, res) => {
  try {
     const user = req.user
    const units = await PrimaryUnit.find({userId:user}); 


    const decryptedUnits = units.map(unit => ({
      _id: unit._id,
      name: decryptData(unit.name),
      status: unit.status,
      createdAt: unit.createdAt,
      updatedAt: unit.updatedAt,
    }));

    return res.status(200).json(
      successResponse(200, "Primary units fetched successfully", null, true, decryptedUnits)
    );
  } catch (error) {
    console.error("Get All PrimaryUnits Error:", error);
    return res.status(500).json(errorResponse(500, error.message, false, "Internal server error"));
  }
};


export const deletePrimaryUnit = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json(errorResponse(400, "Primary unit id is required", false));
    }

    
    const deletedUnit = await PrimaryUnit.findByIdAndDelete(id);

    if (!deletedUnit) {
      return res.status(404).json(errorResponse(404, "Primary unit not found", false));
    }

    return res.status(200).json(
      successResponse(200, "Primary unit deleted successfully", null, true, {
        id: deletedUnit._id,
      })
    );
  } catch (error) {
    console.error("Delete PrimaryUnit Error:", error);
    return res.status(500).json(errorResponse(500, error.message, false, "Internal server error"));
  }
};
