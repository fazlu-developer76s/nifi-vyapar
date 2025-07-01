import Cheque from "../models/Cheque.js";
import Bank from "../models/Bank.js";
import { decryptData, encryptData } from "../lib/encrypt.js";
import { errorResponse, successResponse } from "../lib/reply.js";
import { Company } from "../models/Company.js";
import { AdmCompany } from "../models/userAdminCompany.js";

export const createCheque = async (req, res) => {
  try {
    const user = req.user;

    const {
      bankId,
      chequeSerialNumber,
      from,
      to,
      numberOfLeaves,
      status,
      actionBy,
    } = req.decryptedBody;
    const company = await AdmCompany.find({ actionBy, userId: user });

    if (!company) {
      return res
        .status(404)
        .json(
          errorResponse(404, "Company not found with provided actionBy", false)
        );
    }
    if (!bankId || !chequeSerialNumber) {
      return res
        .status(400)
        .json(
          errorResponse(400, "All required fields must be provided", false)
        );
    }

    const bankExists = await Bank.findOne({
      _id: bankId,
      actionBy,
      userId: user,
    });

    if (!bankExists) {
      return res.status(404).json(errorResponse(404, "Bank not found", false));
    }

    if (from > to) {
      return res
        .status(400)
        .json(
          errorResponse(400, "'from' must be less than or equal to 'to'", false)
        );
    }

    const encryptedSerialNo = encryptData(chequeSerialNumber)?.encryptedData;
    const existingCheque = await Cheque.findOne({
      bankId,
      chequeSerialNumber: encryptedSerialNo,
      actionBy,
    });
    if (existingCheque) {
      return res
        .status(400)
        .json(
          errorResponse(
            400,
            "Cheque Serial Number already exists for this bank",
            false
          )
        );
    }

    const cheque = new Cheque({
      bankId,
      chequeSerialNumber: encryptedSerialNo,
      from: from ? encryptData(from)?.encryptedData : undefined,
      to: to ? encryptData(to)?.encryptedData : undefined,
      numberOfLeaves: numberOfLeaves
        ? encryptData(numberOfLeaves)?.encryptedData
        : undefined,
      status: status || "active",
      userId: user,
      actionBy,
    });
    await cheque.save();

    return res
      .status(201)
      .json(
        successResponse(201, "Cheque created successfully", null, true, cheque)
      );
  } catch (error) {
    console.error("Create Cheque Error:", error);
    return res.status(500).json(errorResponse(500, error.message, false));
  }
};

// export const getAllCheques = async (req, res) => {
//   try {
//     const user = req.user;
//     const { bankId } = req.params;

//     // Find the company
//     const company = await Company.findOne({ userId: user });
//     if (!company) {
//       return res.status(404).json(errorResponse(404, "Company not found", false));
//     }

//     const companyId = company._id;

//     const filter = { userId: user, actionBy: companyId };

//     // Validate bankId
//     if (bankId) {
//       const bankExists = await Bank.findOne({ _id: bankId, userId: user, actionBy: companyId });
//       if (!bankExists) {
//         return res.status(404).json(errorResponse(404, "Bank not found", false));
//       }
//       filter.bankId = bankId;
//     }

//     const cheques = await Cheque.find(filter)
//       .populate({
//         path: 'bankId',
//         select: 'accountDisplayName accountnumber ifscCode bankName branch',
//       })
//       .lean();

//     const decryptedCheques = cheques.map(cheque => {
//       const from = cheque.from ? parseInt(decryptData(cheque.from)) : null;
//       const to = cheque.to ? parseInt(decryptData(cheque.to)) : null;
//       const chequeSerialNumber = cheque.chequeSerialNumber ? parseInt(decryptData(cheque.chequeSerialNumber)) : null;
//       const numberOfLeaves = cheque.numberOfLeaves ? parseInt(decryptData(cheque.numberOfLeaves)) : null;

//       // Generate cheque numbers from range
//       const chequeNumbers = [];
//       if (from != null && to != null && from <= to) {
//         for (let num = from; num <= to; num++) {
//           chequeNumbers.push(num);
//         }
//       }

//       return {
//         _id: cheque._id,
//         bankId: cheque.bankId ? {
//           _id: cheque.bankId._id,
//           accountDisplayName: cheque.bankId.accountDisplayName ? decryptData(cheque.bankId.accountDisplayName) : null,
//           accountnumber: cheque.bankId.accountnumber ? decryptData(cheque.bankId.accountnumber) : null,
//           ifscCode: cheque.bankId.ifscCode ? decryptData(cheque.bankId.ifscCode) : null,
//           bankName: cheque.bankId.bankName ? decryptData(cheque.bankId.bankName) : null,
//           branch: cheque.bankId.branch ? decryptData(cheque.bankId.branch) : null,
//         } : null,
//         chequeSerialNumber,
//         from,
//         to,
//         chequeNumbers,
//         numberOfLeaves,
//         status: cheque.status,
//         createdAt: cheque.createdAt,
//         updatedAt: cheque.updatedAt,
//       };
//     });

//     return res.status(200).json(
//       successResponse(200, "Cheques fetched successfully", null, true, decryptedCheques)
//     );
//   } catch (error) {
//     console.error("Get Cheques Error:", error);
//     return res.status(500).json(errorResponse(500, error.message, false));
//   }
// };

// export const updateCheque = async (req, res) => {
//   try {
//     const user = req.user;
//     const chequeId = req.params.id;
//     const { bankId, chequeSerialNumber, from, to, numberOfLeaves, status } = req.decryptedBody;

//     // Check if cheque exists and belongs to user
//     const existingCheque = await Cheque.findOne({ _id: chequeId, userId: user });
//     if (!existingCheque) {
//       return res.status(404).json(errorResponse(404, "Cheque not found", false));
//     }

//     // Validate required fields
//     if (!bankId || !chequeSerialNumber || from == null || to == null) {
//       return res.status(400).json(errorResponse(400, "All required fields must be provided", false));
//     }

//     const chequeSerialNumberInt = parseInt(chequeSerialNumber);
//     const fromInt = parseInt(from);
//     const toInt = parseInt(to);

//     if (fromInt > toInt) {
//       return res.status(400).json(errorResponse(400, "'from' must be less than or equal to 'to'", false));
//     }

//     if (chequeSerialNumberInt < fromInt || chequeSerialNumberInt > toInt) {
//       return res.status(400).json(errorResponse(400, "Cheque Serial Number must be within the 'from' and 'to' range", false));
//     }

//     // Verify that the new bankId is valid and belongs to the user
//     const bankExists = await Bank.findOne({ _id: bankId, userId: user });
//     if (!bankExists) {
//       return res.status(404).json(errorResponse(404, "Bank not found", false));
//     }

//     const encryptedSerialNo = encryptData(chequeSerialNumberInt)?.encryptedData;

//     // Check for duplicate serial number with different cheque ID
//     const duplicateCheque = await Cheque.findOne({
//       bankId,
//       chequeSerialNumber: encryptedSerialNo,
//       userId: user,
//       _id: { $ne: chequeId }
//     });

//     if (duplicateCheque) {
//       return res.status(400).json(errorResponse(400, "Cheque Serial Number already exists for this bank", false));
//     }

//     // Update the cheque
//     existingCheque.bankId = bankId;
//     existingCheque.chequeSerialNumber = encryptedSerialNo;
//     existingCheque.from = encryptData(fromInt)?.encryptedData;
//     existingCheque.to = encryptData(toInt)?.encryptedData;
//     existingCheque.numberOfLeaves = numberOfLeaves ? encryptData(numberOfLeaves)?.encryptedData : undefined;
//     existingCheque.status = status || existingCheque.status;

//     await existingCheque.save();

//     return res.status(200).json(
//       successResponse(200, "Cheque updated successfully", null, true, existingCheque)
//     );

//   } catch (error) {
//     console.error("Update Cheque Error:", error);
//     return res.status(500).json(errorResponse(500, error.message, false));
//   }
// };

export const getAllCheques = async (req, res) => {
  try {
    const user = req.user;
    const { bankId, actionBy } = req.query;

    const filter = { userId: user };

    // Optional filter for actionBy
    if (actionBy) {
      filter.actionBy = actionBy;
    }

    // Optional filter for bankId
    if (bankId) {
      const bankExists = await Bank.findOne({
        _id: bankId,
        ...(actionBy && { actionBy }),
      });
      if (!bankExists) {
        return res
          .status(404)
          .json(errorResponse(404, "Bank not found", false));
      }
      filter.bankId = bankId;
    }

    const cheques = await Cheque.find(filter)
      .populate({
        path: "bankId",
        select: "accountDisplayName accountnumber ifscCode bankName branch",
      })
      .lean();

    const decryptedCheques = cheques.map((cheque) => {
      const decryptedFrom = cheque.from
        ? parseInt(decryptData(cheque.from))
        : null;
      const decryptedTo = cheque.to ? parseInt(decryptData(cheque.to)) : null;
      const decryptedSerial = cheque.chequeSerialNumber
        ? decryptData(cheque.chequeSerialNumber)
        : null;
      const decryptedLeaves = cheque.numberOfLeaves
        ? parseInt(decryptData(cheque.numberOfLeaves))
        : null;

      return {
        _id: cheque._id,
        bankId: cheque.bankId
          ? {
              _id: cheque.bankId._id,
              accountDisplayName: cheque.bankId.accountDisplayName
                ? decryptData(cheque.bankId.accountDisplayName)
                : null,
              accountnumber: cheque.bankId.accountnumber
                ? decryptData(cheque.bankId.accountnumber)
                : null,
              ifscCode: cheque.bankId.ifscCode
                ? decryptData(cheque.bankId.ifscCode)
                : null,
              bankName: cheque.bankId.bankName
                ? decryptData(cheque.bankId.bankName)
                : null,
              branch: cheque.bankId.branch
                ? decryptData(cheque.bankId.branch)
                : null,
            }
          : null,
        chequeSerialNumber: decryptedSerial ? parseInt(decryptedSerial) : null,
        from: decryptedFrom,
        to: decryptedTo,
        numberOfLeaves: decryptedLeaves,
        status: cheque.status,
        createdAt: cheque.createdAt,
        updatedAt: cheque.updatedAt,
        actionBy: cheque.actionBy
          ? {
              _id: cheque.actionBy._id,
              CompanyName: cheque.actionBy.CompanyName
                ? decryptData(cheque.actionBy.CompanyName)
                : null,
              CompanyMobile: cheque.actionBy.CompanyMobile
                ? decryptData(cheque.actionBy.CompanyMobile)
                : null,
              Companyemail: cheque.actionBy.Companyemail
                ? decryptData(cheque.actionBy.Companyemail)
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
          "Cheques fetched successfully",
          null,
          true,
          decryptedCheques
        )
      );
  } catch (error) {
    console.error("Get Cheques Error:", error);
    return res.status(500).json(errorResponse(500, error.message, false));
  }
};

export const getCheques = async (req, res) => {
  try {
    const user = req.user;

    const filter = { userId: user };

    const cheques = await Cheque.find(filter)
      .populate({
        path: "bankId",
        select: "accountDisplayName accountnumber ifscCode bankName branch",
      })
      .populate({
        path: "actionBy",
        select: "CompanyName CompanyMobile Companyemail",
      })
      .lean();

    const decryptedCheques = cheques.map((cheque) => {
      const decryptedFrom = cheque.from
        ? parseInt(decryptData(cheque.from))
        : null;
      const decryptedTo = cheque.to ? parseInt(decryptData(cheque.to)) : null;
      const decryptedSerial = cheque.chequeSerialNumber
        ? decryptData(cheque.chequeSerialNumber)
        : null;
      const decryptedLeaves = cheque.numberOfLeaves
        ? parseInt(decryptData(cheque.numberOfLeaves))
        : null;

      return {
        _id: cheque._id,
        bankId: cheque.bankId
          ? {
              _id: cheque.bankId._id,
              accountDisplayName: cheque.bankId.accountDisplayName
                ? decryptData(cheque.bankId.accountDisplayName)
                : null,
              accountnumber: cheque.bankId.accountnumber
                ? decryptData(cheque.bankId.accountnumber)
                : null,
              ifscCode: cheque.bankId.ifscCode
                ? decryptData(cheque.bankId.ifscCode)
                : null,
              bankName: cheque.bankId.bankName
                ? decryptData(cheque.bankId.bankName)
                : null,
              branch: cheque.bankId.branch
                ? decryptData(cheque.bankId.branch)
                : null,
            }
          : null,
        chequeSerialNumber: decryptedSerial ? parseInt(decryptedSerial) : null,
        from: decryptedFrom,
        to: decryptedTo,
        numberOfLeaves: decryptedLeaves,
        status: cheque.status,
        createdAt: cheque.createdAt,
        updatedAt: cheque.updatedAt,
        actionBy: cheque.actionBy
          ? {
              _id: cheque.actionBy._id,
              CompanyName: cheque.actionBy.CompanyName
                ? decryptData(cheque.actionBy.CompanyName)
                : null,
              CompanyMobile: cheque.actionBy.CompanyMobile
                ? decryptData(cheque.actionBy.CompanyMobile)
                : null,
              Companyemail: cheque.actionBy.Companyemail
                ? decryptData(cheque.actionBy.Companyemail)
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
          "Cheques fetched successfully",
          null,
          true,
          decryptedCheques
        )
      );
  } catch (error) {
    console.error("Get Cheques Error:", error);
    return res.status(500).json(errorResponse(500, error.message, false));
  }
};

// export const updateCheque = async (req, res) => {
//   try {
//     const user = req.user;
//     const chequeId = req.params.id;
//     const { bankId, chequeSerialNumber, from, to, numberOfLeaves, status } = req.decryptedBody;

//     const company = await Company.findOne({ userId: user });
//     if (!company) {
//       return res.status(404).json(errorResponse(404, "Company not found", false));
//     }
//     const companyId = company._id;

//     // Check if cheque exists and belongs to user and company
//     const existingCheque = await Cheque.findOne({ _id: chequeId, userId: user, actionBy: companyId });
//     if (!existingCheque) {
//       return res.status(404).json(errorResponse(404, "Cheque not found", false));
//     }

//     // Validate required fields
//     if (!bankId || chequeSerialNumber == null || from == null || to == null) {
//       return res.status(400).json(errorResponse(400, "All required fields must be provided", false));
//     }

//     const chequeSerialNumberInt = parseInt(chequeSerialNumber);
//     const fromInt = parseInt(from);
//     const toInt = parseInt(to);

//     if (fromInt > toInt) {
//       return res.status(400).json(errorResponse(400, "'from' must be less than or equal to 'to'", false));
//     }

//     if (chequeSerialNumberInt < fromInt || chequeSerialNumberInt > toInt) {
//       return res.status(400).json(errorResponse(400, "Cheque Serial Number must be within the 'from' and 'to' range", false));
//     }

//     // Verify bank exists and belongs to user/company
//     const bankExists = await Bank.findOne({ _id: bankId, userId: user, actionBy: companyId });
//     if (!bankExists) {
//       return res.status(404).json(errorResponse(404, "Bank not found", false));
//     }

//     const encryptedSerialNo = encryptData(chequeSerialNumberInt)?.encryptedData;
//     const encryptedFrom = encryptData(fromInt)?.encryptedData;
//     const encryptedTo = encryptData(toInt)?.encryptedData;
//     const encryptedLeaves = numberOfLeaves != null ? encryptData(parseInt(numberOfLeaves))?.encryptedData : undefined;

//     // Check for duplicate serial number in other cheques
//     const duplicateCheque = await Cheque.findOne({
//       _id: { $ne: chequeId },
//       bankId,
//       chequeSerialNumber: encryptedSerialNo,
//       userId: user,
//       actionBy: companyId
//     });

//     if (duplicateCheque) {
//       return res.status(400).json(errorResponse(400, "Cheque Serial Number already exists for this bank", false));
//     }

//     // Update cheque
//     existingCheque.bankId = bankId;
//     existingCheque.chequeSerialNumber = encryptedSerialNo;
//     existingCheque.from = encryptedFrom;
//     existingCheque.to = encryptedTo;
//     if (encryptedLeaves !== undefined) {
//       existingCheque.numberOfLeaves = encryptedLeaves;
//     }
//     existingCheque.status = status || existingCheque.status;

//     await existingCheque.save();

//     return res.status(200).json(
//       successResponse(200, "Cheque updated successfully", null, true, existingCheque)
//     );

//   } catch (error) {
//     console.error("Update Cheque Error:", error);
//     return res.status(500).json(errorResponse(500, error.message, false));
//   }
// };

export const updateCheque = async (req, res) => {
  try {
    console.log("inside put");

    const { chequeId, actionBy } = req.params;

    const { bankId, chequeSerialNumber, from, to, numberOfLeaves, status } =
      req.decryptedBody;

    if (!actionBy) {
      return res
        .status(400)
        .json(
          errorResponse(400, "Missing required parameter: actionBy", false)
        );
    }

    const existingCheque = await Cheque.findOne({ _id: chequeId, actionBy });
    if (!existingCheque) {
      return res
        .status(404)
        .json(errorResponse(404, "Cheque not found", false));
    }

    if (!bankId || !chequeSerialNumber) {
      return res
        .status(400)
        .json(
          errorResponse(400, "All required fields must be provided", false)
        );
    }

    const bankExists = await Bank.findOne({ _id: bankId, actionBy });
    if (!bankExists) {
      return res.status(404).json(errorResponse(404, "Bank not found", false));
    }

    if (from && to && from > to) {
      return res
        .status(400)
        .json(
          errorResponse(400, "'from' must be less than or equal to 'to'", false)
        );
    }

    const encryptedSerialNo = encryptData(chequeSerialNumber)?.encryptedData;

    const duplicateCheque = await Cheque.findOne({
      _id: { $ne: chequeId },
      bankId,
      chequeSerialNumber: encryptedSerialNo,
      actionBy,
    });

    if (duplicateCheque) {
      return res
        .status(400)
        .json(
          errorResponse(
            400,
            "Cheque Serial Number already exists for this bank",
            false
          )
        );
    }

    // Update fields
    existingCheque.bankId = bankId;
    existingCheque.chequeSerialNumber = encryptedSerialNo;
    existingCheque.from = from ? encryptData(from)?.encryptedData : undefined;
    existingCheque.to = to ? encryptData(to)?.encryptedData : undefined;
    existingCheque.numberOfLeaves = numberOfLeaves
      ? encryptData(numberOfLeaves)?.encryptedData
      : undefined;
    existingCheque.status = status || "active";

    await existingCheque.save();

    return res
      .status(200)
      .json(
        successResponse(
          200,
          "Cheque updated successfully",
          null,
          true,
          existingCheque
        )
      );
  } catch (error) {
    console.error("Update Cheque Error:", error);
    return res.status(500).json(errorResponse(500, error.message, false));
  }
};

export const deleteCheque = async (req, res) => {
  try {
    const { id } = req.params;

    const cheque = await Cheque.findOne({ _id: id });
    if (!cheque) {
      return res
        .status(404)
        .json(errorResponse(404, "Cheque not found", false));
    }

    await Cheque.deleteOne({ _id: id });

    return res
      .status(200)
      .json(successResponse(200, "Cheque deleted successfully", null, true));
  } catch (error) {
    console.error("Delete Cheque Error:", error);
    return res.status(500).json(errorResponse(500, error.message, false));
  }
};
