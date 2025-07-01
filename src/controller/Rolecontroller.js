import { decryptData } from "../lib/encrypt.js";
import { errorResponse, successResponse } from "../lib/reply.js";
import Role from "../models/Role.js";
import User from "../models/User.js";



export const createOrUpdateRole = async (req, res) => {
  try {
    // const { body } = req.body;
    // const decryptbodydata = decryptData(body);

    // if (!decryptbodydata) {
    //   return res.status(400).json(errorResponse(400, "Invalid encrypted data", false));
    // }

    const user = req?.user;
    // const parseBodyData = JSON.parse(decryptbodydata);
    const { Role: roleValue, status, userId, roleId } = req.decryptedBody;

    if (!roleValue || !["1", "2", "3", "4", "5", "6", "7"].includes(roleValue)) {
      return res.status(400).json(errorResponse(400, "Invalid Role", false));
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json(errorResponse(404, "User not found", false));
    }

    const updateData = {
      Role: roleValue,
      status: status || "active",
      userId: userId,
    };

    // If roleId is provided => update, else create
    if (roleId) {
      const existingRole = await Role.findById(roleId);
      if (!existingRole) {
        return res.status(404).json(errorResponse(404, "Role not found", false));
      }
      Object.assign(existingRole, updateData);
      await existingRole.save();
      return res.status(200).json(successResponse(200, "Role updated successfully", "",true));
    }

    // Else create
    const newRole = new Role(updateData);
    await newRole.save();
    return res.status(201).json(successResponse(201, "Role created successfully", true));
  } catch (error) {
    console.log(error)
    return res.status(500).json(errorResponse(500, "Something went wrong", false));
  }
};


export const getAllRoles = async (req, res) => {
  try {
  
    const roles = await Role.find().populate("userId", "email mobile"); 
    return res.status(200).json(successResponse(200, "All roles fetched successfully", "",true, roles));
  } catch (error) {
    return res.status(500).json(errorResponse(500, "Something went wrong", false));
  }
};


export const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id).populate("userId", "email mobile");
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.status(200).json({ data: role });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};





export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json(errorResponse(404, "Role not found", false));
    }

    await role.deleteOne();
    return res.status(200).json(successResponse(200, "Role deleted successfully", true));
  } catch (error) {
    return res.status(500).json(errorResponse(500, "Something went wrong", false));
  }
};