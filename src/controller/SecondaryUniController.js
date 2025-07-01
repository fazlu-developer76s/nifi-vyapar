import SecondaryUnit from "../models/SecondaryUnit.js";
import { errorResponse, successResponse } from "../lib/reply.js";
import { encryptData,decryptData } from "../lib/encrypt.js";


//   try {
//     const { body } = req.body;
//     const { name } = JSON.parse(decryptData(body));

//     if (!name) {
//       return res.status(400).json(errorResponse(400, "Secondary unit name is required", false));
//     }

//     const units = await SecondaryUnit.find();
//     const isDuplicate = units.some(unit =>
//       JSON.parse(decryptData(unit.name)).trim().toLowerCase() === name.trim().toLowerCase()
//     );

//     if (isDuplicate) {
//       return res.status(409).json(errorResponse(409, "Secondary unit already exists", false));
//     }

//     const encryptedName = encryptData(JSON.stringify(name))?.encryptedData;
//     const newUnit = await SecondaryUnit.create({ name: encryptedName });

//     return res.status(201).json(successResponse(201, "Secondary unit created", null, true, {
//       id: newUnit._id
//     }));
//   } catch (error) {
//     console.error("Create SecondaryUnit Error:", error);
//     return res.status(500).json(errorResponse(500, error.message, false));
//   }
// };

// export const getAllSecondaryUnits = async (req, res) => {
//   try {
//     const units = await SecondaryUnit.find().sort({ createdAt: -1 });

//     const result = units.map(unit => ({
//       _id: unit._id,
//       name: JSON.parse(decryptData(unit.name)),
//       createdAt: unit.createdAt,
//       updatedAt: unit.updatedAt
//     }));

//     return res.status(200).json(successResponse(200, "Secondary units fetched", null, true, result));
//   } catch (error) {
//     return res.status(500).json(errorResponse(500, error.message, false));
//   }
// };

export const getSecondaryUnitById = async (req, res) => {
  try {
    const { body } = req.body;
    const { id } = JSON.parse(decryptData(body));

    const unit = await SecondaryUnit.findById(id);
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


//   try {
//     const { body } = req.body;
//     const { id, name } = JSON.parse(decryptData(body));

//     const encryptedName = encryptData(JSON.stringify(name))?.encryptedData;
//     const updated = await SecondaryUnit.findByIdAndUpdate(id, { name: encryptedName }, { new: true });

//     if (!updated) return res.status(404).json(errorResponse(404, "Unit not found", false));

//     const data = {
//       _id: updated._id,
//       name: JSON.parse(decryptData(updated.name)),
//       createdAt: updated.createdAt,
//       updatedAt: updated.updatedAt
//     };

//     return res.status(200).json(successResponse(200, "Unit updated", null, true, data));
//   } catch (error) {
//     return res.status(500).json(errorResponse(500, error.message, false));
//   }
// };

// export const deleteSecondaryUnit = async (req, res) => {
//   try {
//     const { body } = req.body;
//     const { id } = JSON.parse(decryptData(body));

//     const deleted = await SecondaryUnit.findByIdAndDelete(id);
//     if (!deleted) return res.status(404).json(errorResponse(404, "Unit not found", false));

//     return res.status(200).json(successResponse(200, "Unit deleted", null, true));
//   } catch (error) {
//     return res.status(500).json(errorResponse(500, error.message, false));
//   }
// };
export const createSecondaryUnit = async (req, res) => {
  try {
    const user=req.user
    // const { body } = req.body;
    const { name, status } =req.decryptedBody;

    // Check if 'name' is provided
    if (!name || name.trim() === "") {
      return res.status(400).json(errorResponse(400, "Secondary unit name is required", false));
    }

    // Check for duplicate secondary unit name
    const units = await SecondaryUnit.find({userId:user});
    const isDuplicate = units.some(unit => {
      const decryptedName = decryptData(unit.name);
      return decryptedName.trim().toLowerCase() === name.trim().toLowerCase();
    });

    if (isDuplicate) {
      return res.status(409).json(errorResponse(409, "Secondary unit already exists", false));
    }

    // Set default status if not provided
    const finalStatus = status || "active";

    // Encrypt the name before saving
    const encryptedName = encryptData(name)?.encryptedData;

    // Create new secondary unit
    const newUnit = await SecondaryUnit.create({ name: encryptedName, status: finalStatus,userId:user });

    // Return success response
    return res.status(201).json(
      successResponse(201, "Secondary Unit created successfully", null, true, {
        id: newUnit._id,
      })
    );
  } catch (error) {
    console.error("Create SecondaryUnit Error:", error);
    return res.status(500).json(errorResponse(500, error.message, false, "Internal server error"));
  }
};

// Get All SecondaryUnits
export const getAllSecondaryUnits = async (req, res) => {
  try {
    const units = await SecondaryUnit.find().sort({ createdAt: -1 });

    const result = units.map(unit => ({
      _id: unit._id,
      name: decryptData(unit.name),
      status: unit.status,
      createdAt: unit.createdAt,
      updatedAt: unit.updatedAt,
    }));

    return res.status(200).json(successResponse(200, "Secondary units fetched", null, true, result));
  } catch (error) {
    console.error("Get All SecondaryUnits Error:", error);
    return res.status(500).json(errorResponse(500, error.message, false, "Internal server error"));
  }
};

export const getOurAllSecondaryUnits = async (req, res) => {
  try {
    const user=req.user
    const units = await SecondaryUnit.find({userId:user}).sort({ createdAt: -1 });

    const result = units.map(unit => ({
      _id: unit._id,
      name: decryptData(unit.name),
      status: unit.status,
      createdAt: unit.createdAt,
      updatedAt: unit.updatedAt,
    }));

    return res.status(200).json(successResponse(200, "Secondary units fetched", null, true, result));
  } catch (error) {
    console.error("Get All SecondaryUnits Error:", error);
    return res.status(500).json(errorResponse(500, error.message, false, "Internal server error"));
  }
};

// Update SecondaryUnit
export const updateSecondaryUnit = async (req, res) => {
  try {
    const user = req.user
    const{id}=req.params
    // const { body } = req.body;
    const {  name, status } = req.decryptedBody;

    // Check if 'id' is provided
    if (!id) {
      return res.status(400).json(errorResponse(400, "Secondary unit id is required", false));
    }

    // Check if 'name' is provided for update
    if (name && name.trim() === "") {
      return res.status(400).json(errorResponse(400, "Secondary unit name cannot be empty", false));
    }

    // Check for duplicate name if 'name' is being updated
    if (name) {
      const units = await SecondaryUnit.find({ _id: { $ne: id },userId:user }); // Exclude the current unit
      const isDuplicate = units.some(unit => {
        const decryptedName = decryptData(unit.name);
        return decryptedName.trim().toLowerCase() === name.trim().toLowerCase();
      });

      if (isDuplicate) {
        return res.status(409).json(errorResponse(409, "Secondary unit name already exists", false));
      }
    }

    // Prepare update data (name and/or status)
    const updateData = {
      ...(name && { name: encryptData(name)?.encryptedData }),
      ...(status && { status }),  // Include status in update if provided
    };

    // Update secondary unit
    const updated = await SecondaryUnit.findByIdAndUpdate(id, updateData, { new: true });

    if (!updated) {
      return res.status(404).json(errorResponse(404, "Secondary unit not found", false));
    }

    // Return success response with decrypted data
    const decryptedUpdated = {
      _id: updated._id,
      name: name ? decryptData(updated.name) : undefined,
      status: updated.status,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };

    return res.status(200).json(
      successResponse(200, "Secondary unit updated successfully", null, true, decryptedUpdated)
    );
  } catch (error) {
    console.error("Update SecondaryUnit Error:", error);
    return res.status(500).json(errorResponse(500, error.message, false, "Internal server error"));
  }
};

// Delete SecondaryUnit
export const deleteSecondaryUnit = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json(errorResponse(400, "Secondary unit id is required", false));
    }

    // Delete secondary unit
    const deletedUnit = await SecondaryUnit.findByIdAndDelete(id);

    if (!deletedUnit) {
      return res.status(404).json(errorResponse(404, "Secondary unit not found", false));
    }

    return res.status(200).json(
      successResponse(200, "Secondary unit deleted successfully", null, true, {
        id: deletedUnit._id,
      })
    );
  } catch (error) {
    console.error("Delete SecondaryUnit Error:", error);
    return res.status(500).json(errorResponse(500, error.message, false, "Internal server error"));
  }
};
