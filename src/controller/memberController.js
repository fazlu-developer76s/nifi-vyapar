import { decryptData, encryptData } from "../lib/encrypt.js";
import { errorResponse, successResponse } from "../lib/reply.js";
import { AdminRole } from "../models/AdminRoleModel.js";
import { Member } from "../models/member.js";

// const createMember = async (req, res) => {
//   try {
//     const { body } = req.body;
//     console.log("Request Body:", body);

//     const decryptedBody = decryptData(body);
//     console.log("Decrypted Body:", decryptedBody);

//     const parsedBody = JSON.parse(decryptedBody);
//     console.log("Parsed Body:", parsedBody);

//     const { name, email, mobile, status, role } = parsedBody;

//     if (!name || !email || !mobile || !status) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Missing required fields", false));
//     }

//     if (status !== true && status !== false) {
//       return res
//         .status(400)
//         .json(
//           errorResponse(
//             400,
//             "Invalid status. Only true or false allowed.",
//             false
//           )
//         );
//     }

//     const encryptedRole = encryptData(JSON.stringify(role))?.encryptedData;
//     const existingRole = await AdminRole.findOne({
//       $or: [{ RoleName: encryptedRole }, { status: { $ne: true } }],
//     });

//     if (!existingRole) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Invalid role or deactive", false));
//     }

//     const encryptedName = encryptData(JSON.stringify(name))?.encryptedData;
//     const encryptedEmail = encryptData(JSON.stringify(email))?.encryptedData;
//     const encryptedMobile = encryptData(JSON.stringify(mobile))?.encryptedData;
//     const encryptedStatus = encryptData(JSON.stringify(status))?.encryptedData;

//     const existingMember = await Member.findOne({ email: encryptedEmail });
//     if (existingMember) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Email already exists", false));
//     }

//     const encryptedRoleId = existingRole._id;

//     const newMember = new Member({
//       name: encryptedName,
//       email: encryptedEmail,
//       mobile: encryptedMobile,
//       status: encryptedStatus,
//       role: encryptedRoleId,
//     });

//     const savedMember = await newMember.save();

//     const populatedMember = await Member.findById(savedMember._id).populate(
//       "role"
//     );

//     return res
//       .status(201)
//       .json(
//         successResponse(
//           201,
//           "Member created successfully",
//           "",
//           true,
//           populatedMember,
//         )
//       );
//   } catch (error) {
//     console.error("Error Details:", error);
//     return res
//       .status(500)
//       .json(errorResponse(500, "Something went wrong", false));
//   }
// };

// const getMembers = async (req, res) => {
//   try {
//     const members = await Member.find().populate("role");

//     if (!members || members.length === 0) {
//       return res
//         .status(404)
//         .json(errorResponse(404, "No members found", false));
//     }

//     const decryptedMembers = members.map((member) => {
//       return {
//         _id: member._id,
//         name: JSON.parse(decryptData(member.name)),
//         email: JSON.parse(decryptData(member.email)),
//         mobile: JSON.parse(decryptData(member.mobile)),
//         status: JSON.parse(decryptData(member.status)),
//         role: member.role,
//       };
//     });

//     return res
//       .status(200)
//       .json(
//         successResponse(
//           200,

//           "Members fetched successfully",
//           "",
//           true,
//           decryptedMembers,
//         )
//       );
//   } catch (error) {
//     console.error("Error Details:", error);
//     return res
//       .status(500)
//       .json(errorResponse(500, "Something went wrong", false));
//   }
// };

const createMember = async (req, res) => {
  try {
    // const { body } = req.body;
    // console.log("Request Body:", body);

    // const decryptedBody = decryptData(body);
    // console.log("Decrypted Body:", decryptedBody);

    // const parsedBody = JSON.parse(decryptedBody);
    // console.log("Parsed Body:", parsedBody);

    const { name, email, mobile, status, role } = req.decryptedBody;

    if (!name || !email || !mobile || status === undefined) {
      return res
        .status(400)
        .json(errorResponse(400, "Missing required fields", false));
    }

    if (status !== "true" && status !== "false") {
      return res
        .status(400)
        .json(
          errorResponse(
            400,
            "Invalid status. Only true or false allowed.",
            false
          )
        );
    }

    // const encryptedRole = encryptData(JSON.stringify(role))?.encryptedData;
    const existingRole = await AdminRole.findById({
      _id: role,
      status: true,
    });

    if (!existingRole) {
      return res
        .status(400)
        .json(errorResponse(400, "Invalid role or deactive", false));
    }

    const encryptedName = encryptData(JSON.stringify(name))?.encryptedData;
    const encryptedEmail = encryptData(JSON.stringify(email))?.encryptedData;
    const encryptedMobile = encryptData(JSON.stringify(mobile))?.encryptedData;
    const encryptedStatus = encryptData(JSON.stringify(status))?.encryptedData;

    const existingMember = await Member.findOne({ email: encryptedEmail });
    if (existingMember) {
      return res
        .status(400)
        .json(errorResponse(400, "Email already exists", false));
    }

    const encryptedRoleId = existingRole._id;

    const newMember = new Member({
      name: encryptedName,
      email: encryptedEmail,
      mobile: encryptedMobile,
      status: encryptedStatus,
      role: encryptedRoleId,
    });

    const savedMember = await newMember.save();

    const populatedMember = await Member.findById(savedMember._id).populate(
      "role"
    );

    const decryptedMember = {
      _id: populatedMember._id,
      name: JSON.parse(decryptData(populatedMember.name)),
      email: JSON.parse(decryptData(populatedMember.email)),
      mobile: JSON.parse(decryptData(populatedMember.mobile)),
      status: JSON.parse(decryptData(populatedMember.status)),
      role: {
        _id: populatedMember.role._id,
        AdminRolename: JSON.parse(
          decryptData(populatedMember.role.AdminRolename)
        ),
        status: JSON.parse(decryptData(populatedMember.role.status)),
        createdAt: populatedMember.role.createdAt,
        updatedAt: populatedMember.role.updatedAt,
        __v: populatedMember.role.__v,
      },
      createdAt: populatedMember.createdAt,
      __v: populatedMember.__v,
    };

    return res
      .status(201)
      .json(
        successResponse(
          201,
          "Member created successfully",
          "",
          true,
          decryptedMember
        )
      );
  } catch (error) {
    console.error("Error Details:", error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false));
  }
};

const getMembers = async (req, res) => {
  try {
    const members = await Member.find().populate("role");

    if (!members || members.length === 0) {
      return res
        .status(404)
        .json(errorResponse(404, "No members found", false));
    }

    const decryptedMembers = members.map((member) => {
      return {
        _id: member._id,
        name: member.name ? JSON.parse(decryptData(member.name)) : null,
        email: member.email ? JSON.parse(decryptData(member.email)) : null,
        mobile: member.mobile ? JSON.parse(decryptData(member.mobile)) : null,
        status: member.status ? JSON.parse(decryptData(member.status)) : null,
        role: member.role
          ? {
              _id: member.role._id,
              AdminRolename: member.role.AdminRolename
                ? JSON.parse(decryptData(member.role.AdminRolename))
                : null,
              status: member.role.status
                ? JSON.parse(decryptData(member.role.status))
                : null,
            }
          : null,
      };
    });

    return res
      .status(200)
      .json(
        successResponse(
          200,
          "Members fetched successfully",
          "",
          true,
          decryptedMembers
        )
      );
  } catch (error) {
    console.error("Error in getMembers:", error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false));
  }
};

const getMemberById = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await Member.findById(id).populate("role");

    if (!member) {
      return res
        .status(404)
        .json(errorResponse(404, "Member not found", false));
    }

    const decryptedMember = {
      _id: member._id,
      name: JSON.parse(decryptData(member.name)),
      email: JSON.parse(decryptData(member.email)),
      mobile: JSON.parse(decryptData(member.mobile)),
      status: JSON.parse(decryptData(member.status)),
      role: member.role,
    };

    return res
      .status(200)
      .json(
        successResponse(
          200,
          "Member fetched successfully",
          "",
          true,
          decryptedMember
        )
      );
  } catch (error) {
    console.error("Error Details:", error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false));
  }
};

const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    // const { body } = req.body;

    // const decryptedBody = decryptData(body);
    // const parsedBody = JSON.parse(decryptedBody);
    // console.log("Parsed Body:", parsedBody);

    const { name, email, mobile, status, role, type } = req.decryptedBody;

    if (status !== "true" && status !== "false") {
      return res
        .status(400)
        .json(
          errorResponse(
            400,
            "Invalid status. Only true or false allowed.",
            false
          )
        );
    }

    const encryptedRole = encryptData(JSON.stringify(role))?.encryptedData;
    const existingRole = await AdminRole.findOne({
      $or: [{ RoleName: encryptedRole }, { status: { $ne: true } }],
    });

    if (!existingRole) {
      return res
        .status(400)
        .json(errorResponse(400, "Invalid role or inactive", false));
    }

    const encryptedName = encryptData(JSON.stringify(name))?.encryptedData;
    const encryptedEmail = encryptData(JSON.stringify(email))?.encryptedData;
    const encryptedMobile = encryptData(JSON.stringify(mobile))?.encryptedData;
    const encryptedStatus = encryptData(JSON.stringify(status))?.encryptedData;

    let updatedMember;

    if (type === "update_status") {
      updatedMember = await Member.findByIdAndUpdate(
        id,
        { status: encryptedStatus },
        { new: true }
      ).populate("role");

      if (!updatedMember) {
        return res
          .status(404)
          .json(errorResponse(404, "Member not found", false));
      }

      const decryptedStatusOnly = {
        _id: updatedMember._id,
        status: JSON.parse(decryptData(updatedMember.status)),
        role: updatedMember.role,
      };

      return res
        .status(200)
        .json(
          successResponse(
            200,
            "Status updated successfully",
            "",
            true,
            decryptedStatusOnly
          )
        );
    }

    updatedMember = await Member.findByIdAndUpdate(
      id,
      {
        name: encryptedName,
        email: encryptedEmail,
        mobile: encryptedMobile,
        status: encryptedStatus,
        role: existingRole._id,
      },
      { new: true }
    ).populate("role");

    if (!updatedMember) {
      return res
        .status(404)
        .json(errorResponse(404, "Member not found", false));
    }

    const decryptedUpdatedMember = {
      _id: updatedMember._id,
      name: JSON.parse(decryptData(updatedMember.name)),
      email: JSON.parse(decryptData(updatedMember.email)),
      mobile: JSON.parse(decryptData(updatedMember.mobile)),
      status: JSON.parse(decryptData(updatedMember.status)),
      role: updatedMember.role,
    };

    return res
      .status(200)
      .json(
        successResponse(
          200,
          "Member updated successfully",
          "",
          true,
          decryptedUpdatedMember
        )
      );
  } catch (error) {
    console.error("Error Details:", error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false));
  }
};

const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json(errorResponse(400, "Member ID is required", false));
    }

    const deletedMember = await Member.findByIdAndDelete(id);

    if (!deletedMember) {
      return res
        .status(404)
        .json(errorResponse(404, "Member not found", false));
    }

    return res
      .status(200)
      .json(successResponse(200, "Member deleted successfully", null, true));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false));
  }
};

export { createMember, getMembers, getMemberById, updateMember, deleteMember };
