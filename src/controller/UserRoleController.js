import { decryptData, encryptData } from "../lib/encrypt.js";
import { errorResponse, successResponse } from "../lib/reply.js";
import { UserRole } from "../models/UserRole.js";

// const createUserRole = async (req, res) => {
//     try {

//     //   const { body } = req.body;
//     //   const decryptbodydata = decryptData(body);
//     //   const parsebodyData = JSON.parse(decryptbodydata);
//     const user=req.user
//       const { UserRolename, status = true } = req.decryptedBody;

//           if (!UserRolename) {
//               return res.status(400).json(errorResponse(400, "Please Provide a Role.", false));
//           }

//           const findroleData= await UserRole.findOne({UserRolename:UserRolename,userId:user})
//           if(findroleData){
//               return res.status(404).json(errorResponse(404, "this Role already exist", false))
//           }

//           let encryptedstatus;
//           if (status === '') {
//               encryptedstatus = encryptData(JSON.stringify(status))?.encryptedData

//           } else {
//               if (status !== true && status !== false) {
//                   return res.status(400).json(errorResponse(400, "Invalid status. Only true or false are allowed.", false));
//               }

//           }
//           const encryptedUserRolename = encryptData(JSON.stringify(UserRolename))?.encryptedData;
//            encryptedstatus = encryptData(JSON.stringify(status))?.encryptedData

//           const role = await UserRole.create({ UserRolename: encryptedUserRolename, status: encryptedstatus,userId:user});

//           if (!role) {
//               return res.status(404).json(errorResponse(404, "failed to create", false))
//           }
//           return res.status(201).json(successResponse(201, "role created successfully", "", true, ""));
//       } catch (error) {
//           return res.status(501).json(errorResponse(501, "Something went wrong", false));
//       }
//   };

const createUserRole = async (req, res) => {
  try {
    const user = req.user;
    const { UserRolename, status = true } = req.decryptedBody;

    if (!UserRolename) {
      return res
        .status(400)
        .json(errorResponse(400, "Please provide a role name.", false));
    }

    const existingRoles = await UserRole.find({ userId: user });

    for (const role of existingRoles) {
      if (!role.UserRolename || typeof role.UserRolename !== "string") continue;

      let decryptedRoleName = "";
      try {
        decryptedRoleName = decryptData(role.UserRolename);
      } catch (err) {
        console.error(`Decryption failed for role ID ${role._id}:`, err.message);
        continue;
      }

      if (decryptedRoleName.toLowerCase() === UserRolename.toLowerCase()) {
        return res
          .status(400)
          .json(errorResponse(400, "This role already exists.", false));
      }
    }

    if (status !== true && status !== false) {
      return res
        .status(400)
        .json(
          errorResponse(400, "Invalid status. Only true or false are allowed.", false)
        );
    }

    const encryptedUserRolename = encryptData(UserRolename)?.encryptedData;
    const encryptedStatus = encryptData(JSON.stringify(status))?.encryptedData;

    const role = await UserRole.create({
      UserRolename: encryptedUserRolename,
      status: encryptedStatus,
      userId: user,
    });

    return res
      .status(201)
      .json(successResponse(201, "Role created successfully", "", true, ""));
  } catch (error) {
    console.error("CreateUserRole Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false));
  }
};

const getUserRoles = async (req, res) => {
  try {
    const user = req.user;
    const findData = await UserRole.find({ userId: user });
    if (!findData || findData.length === 0) {
      return res.status(404).json(errorResponse(404, "No role found", false));
    }

    const decryptedPackages = findData.map((roleItem) => {
      const decryptedName = roleItem.UserRolename
        ? decryptData(roleItem.UserRolename)
        : null;
      const decryptedStatusStr = roleItem.status
        ? decryptData(roleItem.status)
        : null;
      let parsedStatus = null;
      try {
        parsedStatus = decryptedStatusStr
          ? JSON.parse(decryptedStatusStr)
          : null;
      } catch (err) {
        parsedStatus = null; // In case the decrypted status is not valid JSON
      }

      return {
        UserRolename: decryptedName,
        status: parsedStatus,
        _id: roleItem._id,
      };
    });

    return res
      .status(201)
      .json(
        successResponse(
          201,
          "get data successfully",
          "",
          true,
          decryptedPackages
        )
      );
  } catch (error) {
    console.log(error);
    return res
      .status(503)
      .json(errorResponse(503, "Something went wrong", false));
  }
};

const getUserRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const findData = await UserRole.findById(id);
    if (!findData) {
      return res.status(404).json(errorResponse(404, "Not found", false));
    }

    const decryptedUserRolename = JSON.parse(
      decryptData(findData.UserRolename)
    );
    const decryptedstatus = JSON.parse(decryptData(findData.status));

    const roleData = {
      UserRolename: decryptedUserRolename,
      status: decryptedstatus,
      _id: findData._id,
    };

    return res
      .status(200)
      .json(successResponse(200, "Fetched role data", roleData, true));
  } catch (error) {
    console.error("Error in getRoleById:", error);
    return res
      .status(503)
      .json(errorResponse(503, "Something went wrong", false));
  }
};

//   const updateUserRole = async (req, res) => {
//     try {

//       const { id } = req.params;
//     //   const { body } = req.body;

//     //   const decryptedBody = decryptData(body);
//     //   const parsedBody = JSON.parse(decryptedBody);

//       const { UserRolename, status } = req.decryptedBody;
//       const findData = await UserRole.findById(id);

//           if (!findData) {
//               return res.status(404).json(errorResponse(404, "Service not found", false));
//           }

//           if (status !== true && status !== false) {
//               return res.status(400).json(errorResponse(400, "Invalid status. Only true or false are allowed.", false));
//           }
//           const dataToUpdate = {};

//           if (findData) {
//               dataToUpdate.UserRolename = encryptData(JSON.stringify(UserRolename))?.encryptedData;
//               dataToUpdate.status = encryptData(JSON.stringify(status))?.encryptedData;

//           }
//           const updatedRole = await UserRole.findByIdAndUpdate(id, dataToUpdate, { new: true });
//           return res.status(200).json(successResponse(200, "Updated successfully", "", true, updatedRole))

//       } catch (error) {

//           return res.status(503).json(errorResponse(503, "Something went wrong", false));
//       }

//   };

const updateUserRole = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { UserRolename, status } = req.decryptedBody;

    const findData = await UserRole.findById(id);
    if (!findData) {
      return res.status(404).json(errorResponse(404, "Role not found", false));
    }

    if (status !== true && status !== false) {
      return res.status(400).json(
        errorResponse(
          400,
          "Invalid status. Only true or false are allowed.",
          false
        )
      );
    }

    // Check if role name already exists (excluding current one)
    const existingRoles = await UserRole.find({
      userId: user,
      _id: { $ne: id },
    });

    for (const role of existingRoles) {
      if (!role.UserRolename || typeof role.UserRolename !== "string") continue;

      let decryptedRoleName = "";
      try {
        decryptedRoleName = decryptData(role.UserRolename);
      } catch (err) {
        console.error(`Decryption failed for role ID ${role._id}:`, err.message);
        continue;
      }

      if (decryptedRoleName.toLowerCase() === UserRolename.toLowerCase()) {
        return res
          .status(400)
          .json(errorResponse(400, "This role name already exists.", false));
      }
    }

    // Encrypt inputs
    const encryptedUserRolename = encryptData(UserRolename)?.encryptedData;
    const encryptedStatus = encryptData(JSON.stringify(status))?.encryptedData;

    const updatedRole = await UserRole.findByIdAndUpdate(
      id,
      {
        UserRolename: encryptedUserRolename,
        status: encryptedStatus,
      },
      { new: true }
    );

    return res.status(200).json(
      successResponse(200, "Role updated successfully", "", true, updatedRole)
    );
  } catch (error) {
    console.error("UpdateUserRole Error:", error);
    return res
      .status(503)
      .json(errorResponse(503, "Something went wrong", false));
  }
};


const deleteUserRole = async (req, res) => {
  try {
    const role = await UserRole.findByIdAndDelete(req.params.id);
    if (!role) {
      return res.status(503).json(errorResponse(503, "Not found", false));
    }
    return res
      .status(201)
      .json(successResponse(201, "Remove successfully", "", true, ""));
  } catch (error) {
    return res
      .status(503)
      .json(errorResponse(503, "Something went wrong", false));
  }
};

export {
  createUserRole,
  getUserRoleById,
  getUserRoles,
  updateUserRole,
  deleteUserRole,
};
