
import PermissionCategory from '../models/CategoryPermission.js'
import Role from "../models/Role.js";
import UserPermissionRole from '../models/UserPermissionRole.js';
import PermissionSubCategory from "../models/subCategoryPermission.js"
import { errorResponse, successResponse } from "../lib/reply.js";

export const createRolePermission = async (req, res) => {
  try {
    const { RoleId, PermissionId, SubPermissionId, status } =req.decryptedBody;

    // Validation: Check all referenced documents exist
    const role = await Role.findById(RoleId);
    if (!role) return res.status(404).json(errorResponse( 404, "Role not found","",false));

    const permissionCategory = await PermissionCategory.findById(PermissionId);
    if (!permissionCategory) return res .status(404).json (errorResponse( 404, "Permission Category not found","",false));

    const subPermission = await PermissionSubCategory.findById(SubPermissionId);
    if (!subPermission) return res.status(404).json(errorResponse( 404, "Permission Sub Category not found","",false));

    // Check if this combination already exists
    const existing = await UserPermissionRole.findOne({ RoleId, PermissionId, SubPermissionId });
    if (existing) return res.status(400).json (errorResponse( 400, "Permission already assigned to this role","", false));

    const newPermission = await UserPermissionRole.create({
      RoleId,
      PermissionId,
      SubPermissionId,
      status: status || "active",
    });

    return res.status(200).json(successResponse( 201, "Role permission assigned successfully",null,true, newPermission));

  } catch (error) {
    console.log(error)
    return res.status(501).json(errorResponse(501, "Something went wrong", false));
  }
};


export const getAllRolePermissions = async (req, res) => {
  try {
    const permissions = await UserPermissionRole.find()
      .populate("RoleId", "Role")
      .populate("PermissionId", "title")
      .populate("SubPermissionId", "title")
      .sort({ createdAt: -1 });

    const formattedPermissions = permissions.map((perm) => ({
      userPermissionId: perm._id,
      RoleId: perm.RoleId,
      PermissionId: {
        ...perm.PermissionId._doc,
        title: decryptData(perm.PermissionId?.title),
      },
      SubPermissionId: {
        ...perm.SubPermissionId._doc,
        title: perm.SubPermissionId?.title, // keep this as-is if not encrypted
      },
      status: perm.status,
      createdAt: perm.createdAt,
      updatedAt: perm.updatedAt,
    }));

    return res
      .status(200)
      .json(successResponse(200, "Role permissions fetched successfully", null, true, formattedPermissions));
  } catch (error) {
    console.log(error);
    return res
      .status(501)
      .json(errorResponse(501, "Something went wrong", "", false));
  }
};
  export const updateRolePermission = async (req, res) => {
    try {
      const { id } = req.params;
      const { RoleId, PermissionId, SubPermissionId, status } = req.decryptedBody;
  
      const existing = await UserPermissionRole.findById(id);
      if (!existing) {
        return res.status(404).json(errorResponse(404, "Role permission not found", "", false));
      }
  
      
      if (RoleId) existing.RoleId = RoleId;
      if (PermissionId) existing.PermissionId = PermissionId;
      if (SubPermissionId) existing.SubPermissionId = SubPermissionId;
      if (status) existing.status = status;
  
      await existing.save();
  
      return res.status(200).json(successResponse(200, "Role permission updated successfully", null, true, existing));
    } catch (error) {
        console.log(error)
      return res.status(501).json(errorResponse(501, "Something went wrong", "", false));
    }
  };

  export const deleteRolePermission = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deleted = await UserPermissionRole.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json(errorResponse(404, "Role permission not found", "", false));
      }
  
      return res.status(200).json(successResponse(200, "Role permission deleted successfully", null, true, deleted));
    } catch (error) {
      return res.status(501).json(errorResponse(501, "Something went wrong", "", false));
    }
  };