import { decryptData, encryptData } from "../lib/encrypt.js";
import { errorResponse, successResponse } from "../lib/reply.js";
import Godown from "../models/Godown.js";

// export const createGodown = async (req, res) => {
//   try {
//     const user = req.user
//     //   const {body}=req.body;
//     //       const decrypted = decryptData(body);
//     //       const parsed = JSON.parse(decrypted);
//     const {
//       GodownName,
//       emailId,
//       PhnNo,
//       gstIn,
//       GodownAddress,
//       GodownPincode,
//       GodownType,
//     } = req.decryptedBody;

//     const encryptedName = encryptData(GodownName)?.encryptedData;
//     const encryptedAddress = GodownAddress
//       ? encryptData(GodownAddress)?.encryptedData
//       : "";
//     const encryptedPincode = GodownPincode
//       ? encryptData(GodownPincode)?.encryptedData
//       : "";
//     const encryptedEmail = encryptData(emailId)?.encryptedData;
//     const encryptedPhnNo = encryptData(PhnNo)?.encryptedData;
//     const encryptedGstIn = gstIn ? encryptData(gstIn)?.encryptedData : "";

//     const newGodown = await Godown.create({
//       GodownType: GodownType,
//       GodownName: encryptedName,
//       emailId: encryptedEmail,
//       PhnNo: encryptedPhnNo,
//       gstIn: encryptedGstIn,
//       GodownAddress: encryptedAddress,
//       GodownPincode: encryptedPincode,
//       userId:user,

//     });

//     return res
//       .status(201)
//       .json(
//         successResponse(201, "Godown created successfully", null, true, {
//           id: newGodown._id,
//         })
//       );
//   } catch (error) {
//     console.error("Create Godown Error:", error);
//     return res.status(500).json(errorResponse(500, error.message, false));
//   }
// };

export const createGodown = async (req, res) => {
  try {
    const user = req.user;

    const {
      GodownName,
      emailId,
      PhnNo,
      gstIn,
      GodownAddress,
      GodownPincode,
      GodownType,
    } = req.decryptedBody;

    const encryptedName = encryptData(GodownName)?.encryptedData;

    const existingGodown = await Godown.findOne({
      GodownName: encryptedName,
      userId: user._id,
    });
    if (existingGodown) {
      return res
        .status(400)
        .json(errorResponse(400, "Godown Name must be unique", false));
    }

    const encryptedAddress = GodownAddress
      ? encryptData(GodownAddress)?.encryptedData
      : "";
    const encryptedPincode = GodownPincode
      ? encryptData(GodownPincode)?.encryptedData
      : "";
    const encryptedEmail = encryptData(emailId)?.encryptedData;
    const encryptedPhnNo = encryptData(PhnNo)?.encryptedData;
    const encryptedGstIn = gstIn ? encryptData(gstIn)?.encryptedData : "";

    const newGodown = await Godown.create({
      GodownType: GodownType,
      GodownName: encryptedName,
      emailId: encryptedEmail,
      PhnNo: encryptedPhnNo,
      gstIn: encryptedGstIn,
      GodownAddress: encryptedAddress,
      GodownPincode: encryptedPincode,
      userId: user,
    });

    return res.status(201).json(
      successResponse(201, "Godown created successfully", null, true, {
        id: newGodown._id,
      })
    );
  } catch (error) {
    console.error("Create Godown Error:", error);
    return res.status(500).json(errorResponse(500, error.message, false));
  }
};

export const getAllGodowns = async (req, res) => {
  try {
    const godowns = await Godown.find().sort({ createdAt: -1 });

    const decryptedGodowns = godowns.map((g) => ({
      _id: g._id,
      GodownType: g.GodownType,
      GodownName: g.GodownName ? decryptData(g.GodownName) : null,
      emailId: g.emailId ? decryptData(g.emailId) : null,
      PhnNo: g.PhnNo ? decryptData(g.PhnNo) : null,
      gstIn: g.gstIn ? decryptData(g.gstIn) : null,
      GodownAddress: g.GodownAddress ? decryptData(g.GodownAddress) : null,
      GodownPincode: g.GodownPincode ? decryptData(g.GodownPincode) : null,
      createdAt: g.createdAt,
      updatedAt: g.updatedAt,
    }));

    return res
      .status(200)
      .json(
        successResponse(
          200,
          "Godown list fetched",
          null,
          true,
          decryptedGodowns
        )
      );
  } catch (err) {
    console.error("Get All Godowns Error:", err);
    return res.status(500).json(errorResponse(500, err.message, false));
  }
};

export const getOurAllGodowns = async (req, res) => {
  try {
    const user = req.user;
    const godowns = await Godown.find({ userId: user }).sort({ createdAt: -1 });

    const decryptedGodowns = godowns.map((g) => ({
      _id: g._id,
      GodownType: g.GodownType,
      GodownName: g.GodownName ? decryptData(g.GodownName) : null,
      emailId: g.emailId ? decryptData(g.emailId) : null,
      PhnNo: g.PhnNo ? decryptData(g.PhnNo) : null,
      gstIn: g.gstIn ? decryptData(g.gstIn) : null,
      GodownAddress: g.GodownAddress ? decryptData(g.GodownAddress) : null,
      GodownPincode: g.GodownPincode ? decryptData(g.GodownPincode) : null,
      createdAt: g.createdAt,
      updatedAt: g.updatedAt,
    }));

    return res
      .status(200)
      .json(
        successResponse(
          200,
          "Godown list fetched",
          null,
          true,
          decryptedGodowns
        )
      );
  } catch (err) {
    console.error("Get All Godowns Error:", err);
    return res.status(500).json(errorResponse(500, err.message, false));
  }
};

export const updateGodown = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    const {
      GodownName,
      emailId,
      PhnNo,
      gstIn,
      GodownAddress,
      GodownPincode,
      GodownType,
    } = req.decryptedBody;

    const encryptedName = encryptData(GodownName)?.encryptedData;

    const existingGodown = await Godown.findOne({
      GodownName: encryptedName,
      _id: { $ne: id },
      userId: user,
    });

    if (existingGodown) {
      return res
        .status(400)
        .json(errorResponse(400, "Godown Name must be unique", false));
    }

    const encryptedAddress = GodownAddress
      ? encryptData(GodownAddress)?.encryptedData
      : "";
    const encryptedPincode = GodownPincode
      ? encryptData(GodownPincode)?.encryptedData
      : "";
    const encryptedEmail = encryptData(emailId)?.encryptedData;
    const encryptedPhnNo = encryptData(PhnNo)?.encryptedData;
    const encryptedGstIn = gstIn ? encryptData(gstIn)?.encryptedData : "";

    const updatedGodown = await Godown.findByIdAndUpdate(
      id,
      {
        GodownName: encryptedName,
        emailId: encryptedEmail,
        PhnNo: encryptedPhnNo,
        gstIn: encryptedGstIn,
        GodownAddress: encryptedAddress,
        GodownPincode: encryptedPincode,
        GodownType,
      },
      { new: true }
    );

    if (!updatedGodown) {
      return res
        .status(404)
        .json(errorResponse(404, "Godown not found", false));
    }

    return res.status(200).json(
      successResponse(200, "Godown updated successfully", null, true, {
        id: updatedGodown._id,
      })
    );
  } catch (error) {
    console.error("Update Godown Error:", error);
    return res.status(500).json(errorResponse(500, error.message, false));
  }
};

// export const updateGodown = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Prevent update of the Main Store Godown
//     if (id === "6821a3e90f731786fc0ab16a") {
//       return res.status(403).json(
//         errorResponse(403, "Main Store Godown cannot be updated", false)
//       );
//     }

//     const {
//       GodownName,
//       emailId,
//       PhnNo,
//       gstIn,
//       GodownAddress,
//       GodownPincode,
//       GodownType,
//     } = req.decryptedBody;

//     // Encrypt the input fields
//     const encryptedName = GodownName ? encryptData(GodownName)?.encryptedData : undefined;
//     const encryptedAddress = GodownAddress ? encryptData(GodownAddress)?.encryptedData : undefined;
//     const encryptedPincode = GodownPincode ? encryptData(GodownPincode)?.encryptedData : undefined;
//     const encryptedEmail = emailId ? encryptData(emailId)?.encryptedData : undefined;
//     const encryptedPhnNo = PhnNo ? encryptData(PhnNo)?.encryptedData : undefined;
//     const encryptedGstIn = gstIn ? encryptData(gstIn)?.encryptedData : undefined;

//     // Create update object dynamically
//     const updateFields = {
//       ...(encryptedName && { GodownName: encryptedName }),
//       ...(encryptedAddress && { GodownAddress: encryptedAddress }),
//       ...(encryptedPincode && { GodownPincode: encryptedPincode }),
//       ...(encryptedEmail && { emailId: encryptedEmail }),
//       ...(encryptedPhnNo && { PhnNo: encryptedPhnNo }),
//       ...(encryptedGstIn && { gstIn: encryptedGstIn }),
//       ...(GodownType && { GodownType }),
//     };

//     const updatedGodown = await Godown.findByIdAndUpdate(id, updateFields, { new: true });

//     if (!updatedGodown) {
//       return res.status(404).json(errorResponse(404, "Godown not found", false));
//     }

//     return res.status(200).json(
//       successResponse(200, "Godown updated successfully", null, true, {
//         id: updatedGodown._id,
//       })
//     );
//   } catch (error) {
//     console.error("Update Godown Error:", error);
//     return res.status(500).json(errorResponse(500, error.message || "Internal server error", false));
//   }
// };

export const getGodownById = async (req, res) => {
  try {
    const { id } = req.params;

    const godown = await Godown.findById(id);
    if (!godown) {
      return res
        .status(404)
        .json(errorResponse(404, "Godown not found", false));
    }

    const decryptedData = {
      _id: godown._id,
      GodownType: godown.GodownType,
      GodownName: JSON.parse(decryptData(godown.GodownName)),
      emailId: JSON.parse(decryptData(godown.emailId)),
      PhnNo: JSON.parse(decryptData(godown.PhnNo)),
      gstIn: godown.gstIn ? JSON.parse(decryptData(godown.gstIn)) : "",
      GodownAddress: godown.GodownAddress
        ? JSON.parse(decryptData(godown.GodownAddress))
        : "",
      GodownPincode: godown.GodownPincode
        ? JSON.parse(decryptData(godown.GodownPincode))
        : "",
      createdAt: godown.createdAt,
      updatedAt: godown.updatedAt,
    };

    return res
      .status(200)
      .json(
        successResponse(
          200,
          "Godown fetched successfully",
          null,
          true,
          decryptedData
        )
      );
  } catch (error) {
    console.error("Get Godown By ID Error:", error);
    return res.status(500).json(errorResponse(500, error.message, false));
  }
};

export const deleteGodown = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deletion of the Main Store Godown
    if (id === "6821a3e90f731786fc0ab16a") {
      return res
        .status(403)
        .json(errorResponse(403, "Main Store Godown cannot be deleted", false));
    }

    const deletedGodown = await Godown.findByIdAndDelete(id);

    if (!deletedGodown) {
      return res
        .status(404)
        .json(errorResponse(404, "Godown not found", false));
    }

    return res.status(200).json(
      successResponse(200, "Godown deleted successfully", null, true, {
        id: deletedGodown._id,
      })
    );
  } catch (error) {
    console.error("Delete Godown Error:", error);
    return res.status(500).json(errorResponse(500, error.message, false));
  }
};
