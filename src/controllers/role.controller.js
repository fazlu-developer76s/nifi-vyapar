import { Role } from "../models/role.model.js";
import { errorResponse, successResponse } from "../utils/response.js";

export const createRole = async (req, res) => {
  try {
    
    const { role } = req.body;
    const existingRole = await Role.findOne({ role:role , userID:req.user.id });
  
    if (existingRole) {
      errorResponse(res, "Role already exists", 400);
      return;
    }
    const saveRole = await Role.create({ role: role, userID: req.user.id });
    successResponse(res, "Role created successfully", saveRole, 201);
    return;
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find({ userID: req.user.id });
    successResponse(res, "Roles fetched successfully", roles, 200);
    return;
  } catch (error) {
    errorResponse(res, "Error fetching roles", 500, error.message);
    return;
  }
};

export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const roleDoc = await Role.findByIdAndUpdate(id);
    if (!roleDoc) {
       errorResponse(res, "Role not found", 404);
       return;
    }
    const check_role = await Role.findOne({
      role: req.body.role,
      userID: req.user.id,
      _id: { $ne: id },
    });
    // return console.log(check_role.role);
    if (check_role) {
      errorResponse(res, "Role already exists", 400);
      return;
    }
    if (req.body.status) {
      roleDoc.status = req.body.status;
    }
    if (req.body.role) {
      roleDoc.role = req.body.role;
    }
    await roleDoc.save();
    successResponse(res, "Role updated successfully", roleDoc, 200);
    return;
  } catch (err) {
    errorResponse(res, "Error updating role", 500, err.message);
    return;
  }
};

export const deleteRole = async (req, res) => {
  try {
    const deleted = await Role.findByIdAndDelete(req.params.id);
    if (!deleted) {
      errorResponse(res, "Role not found", 404);
      return;
    }
    successResponse(res, "Role deleted successfully", deleted, 200);
    return;
  } catch (err) {
    errorResponse(res, "Error deleting role", 500, err.message);
    return;
  }
};
