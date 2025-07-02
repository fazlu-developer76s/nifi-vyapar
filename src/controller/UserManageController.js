import e from "express";
import { decryptData, encryptData } from "../lib/encrypt.js";
import { errorResponse, successResponse } from "../lib/reply.js";
import { Package } from "../models/Package.js";
import User from "../models/User.js";
import { Usermember } from "../models/Usermanagement.js";
import { UserRole } from "../models/UserRole.js";
import mongoose from "mongoose";

const createUserMember = async (req, res) => {
  try {
    
    const { name, email, mobile, role, status = true } = req.decryptedBody;
    const user = req.user;
    if (status !== true && status !== false) {
      return res
        .status(400)
        .json(
          errorResponse(
            400,
            "Invalid status. Only true or false are allowed.",
            false
          )
        );
    }
    const encryptedTrue = encryptData(JSON.stringify(true))?.encryptedData;
    const existingRole = await UserRole.findOne({
      _id: role,
      status: encryptedTrue,
    });
    if (!existingRole) {
      return res
        .status(400)
        .json(errorResponse(400, "Invalid role or deactive", false));
    }
    const encryptedName = encryptData(name)?.encryptedData;
    const encryptedEmail = encryptData(email)?.encryptedData;
    const encryptedMobile = encryptData(mobile)?.encryptedData;
    const encryptedStatus = encryptData(JSON.stringify(status))?.encryptedData;
    const existingUserMember = await Usermember.findOne({
      email: encryptedEmail,
      userId: user
    });
    if (existingUserMember) {
      return res
        .status(400)
        .json(errorResponse(400, "Email already in use", false));
    }

    let existingUser = await User.findOne({ userId: user });
    if (!existingUser) {
      existingUser = new User({
        _id: user.id,
        name: user.name || "Default",
        email: user.email || "default@example.com",
        mobile: user.mobile || "0000000000",
        memberDetails: [],
      });
      await existingUser.save();
    }

    const newUserMember = new Usermember({
      name: encryptedName,
      email: encryptedEmail,
      mobile: encryptedMobile,
      role: existingRole,
      status: encryptedStatus,
      userId: user,
    });
    await newUserMember.save();

    if (existingUser.memberDetails) {
      existingUser.memberDetails.push({ member_Id: newUserMember._id });
    } else {
      existingUser.memberDetails = [{ member_Id: newUserMember._id }];
    }
    await existingUser.save();
    return res
      .status(201)
      .json(
        successResponse(
          201,
          newUserMember,
          "Member created successfully",
          "",
          true
        )
      );
  } catch (error) {
    console.error("Error in createUserMember:", error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong.", false));
  }
};

const updateUserMember = async (req, res) => {
  try {

    const { id } = req.params;
    const { name, email, mobile, role, status } = req.decryptedBody;
    if (!id) {
      return res
        .status(400)
        .json(errorResponse(400, "Member ID is required", false));
    }
    const member = await Usermember.findById(id);
    if (!member) {
      return res
        .status(404)
        .json(errorResponse(404, "User member not found", false));
    }

    if (name) {
      member.name = encryptData(name).encryptedData;
    }
    const encryptedEmail = encryptData(email).encryptedData;
      const existingUserMember = await Usermember.findOne({
        email: encryptedEmail,
        userId: req.user,
        _id: { $ne: id } // Exclude the current member being updated

      });
    if (existingUserMember) {
      return res
        .status(400)
        .json(errorResponse(400, "Email already in use", false));
    }

    member.email = encryptedEmail;
    if (mobile) {
      member.mobile = encryptData(mobile).encryptedData;
    }
    if (typeof status !== "undefined") {
      if (status !== true && status !== false) {
        return res
          .status(400)
          .json(
            errorResponse(400, "Invalid status. Use true or false.", false)
          );
      }
      member.status = encryptData(JSON.stringify(status)).encryptedData;
    }
    if (role) {
      const encryptedTrue = encryptData(JSON.stringify(true)).encryptedData;
      const existingRole = await UserRole.findOne({
        _id: role,
        status: encryptedTrue,
      });

      if (!existingRole) {
        return res
          .status(400)
          .json(errorResponse(400, "Invalid role or deactive", false));
      }

      member.role = existingRole._id;
    }
    await member.save();
    return res
      .status(200)
      .json(
        successResponse(200, member, "Member updated successfully", "", true)
      );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong.", false));
  }
};

const deleteUserMember = async (req, res) => {
  try {
    const { id } = req.params;
    const UserMember = await Usermember.findById(id);
    if (!UserMember) {
      return res
        .status(404)
        .json(errorResponse(404, "Team member not found", false));
    }
    const findremove = await Usermember.findByIdAndDelete(id);
    if (!findremove) {
      return res
        .status(500)
        .json(errorResponse(500, "failed to remove", false));
    }

    return res
      .status(200)
      .json(
        successResponse(200, "user member deleted successfully", "", true, "")
      );
  } catch (error) {
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong.", false));
  }
};

// const getAllUserMembers = async (req, res) => {
//   try {
//     const userMembers = await Usermember.find().populate(
//       "role",
//       "RoleName status"
//     );

//     if (!userMembers || userMembers.length === 0) {
//       return res
//         .status(404)
//         .json(errorResponse(404, "No user members found", false));
//     }
//     return res
//       .status(200)
//       .json(successResponse(200, "user Members found", userMembers, true));
//   } catch (error) {
//     return res
//       .status(500)
//       .json(errorResponse(500, "Something went wrong.", false));
//   }
// };

const getuserMemberById = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await Usermember.findById(id).populate("role");

    if (!member) {
      return res
        .status(404)
        .json(errorResponse(404, "User member not found", false));
    }

    // Decrypt sensitive fields
    const decryptedMember = {
      _id: member._id,
      name: member.name ? JSON.parse(decryptData(member.name)) : null,
      email: member.email ? JSON.parse(decryptData(member.email)) : null,
      mobile: member.mobile ? JSON.parse(decryptData(member.mobile)) : null,
      status: member.status ? JSON.parse(decryptData(member.status)) : null,
      role: member.role || null,
      package: member.package || null,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    };

    return res
      .status(200)
      .json(
        successResponse(
          200,
          decryptedMember,
          "User member fetched successfully",
          "",
          true
        )
      );
  } catch (error) {
    console.error("Error in getUserMemberById:", error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong.", false));
  }
};

const getAllUserMembers = async (req, res) => {
  try {
    const user = req.user;

    const members = await Usermember.find({ userId: user }).populate("role");

    if (!members || members.length === 0) {
      return res
        .status(404)
        .json(errorResponse(404, "No user members found", false));
    }

    const decryptedMembers = members.map((member) => {
      const decryptedRole = member.role
        ? {
            _id: member.role._id,
            UserRolename: decryptData(member.role.UserRolename),
            status: JSON.parse(decryptData(member.role.status)),
            createdAt: member.role.createdAt,
            updatedAt: member.role.updatedAt,
          }
        : null;

      return {
        _id: member._id,
        name: decryptData(member.name),
        email: decryptData(member.email),
        mobile: decryptData(member.mobile),
        status: JSON.parse(decryptData(member.status)),
        role: decryptedRole,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
      };
    });

    return res
      .status(200)
      .json(
        successResponse(
          200,
          "All user members fetched successfully",
          "",
          true,
          decryptedMembers
        )
      );
  } catch (error) {
    console.error("Error in getAllUserMembers:", error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong.", false));
  }
};

export {
  createUserMember,
  updateUserMember,
  deleteUserMember,
  getAllUserMembers,
  getuserMemberById,
};
