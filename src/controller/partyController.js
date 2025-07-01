import { decryptData, encryptData } from "../lib/encrypt.js";
import { errorResponse, successResponse } from "../lib/reply.js";
import { Company } from "../models/Company.js";
import Party from "../models/Party.js";
import { AdmCompany } from "../models/userAdminCompany.js";

//   try {
//     const { body } = req.body;
//     const decrypted = JSON.parse(decryptData(body));

//     const {
//       partyName,
//       gstin,
//       phoneNumber,
//       gstType,
//       emailId,
//       address,
//       creditBalance,
//       additionalFields,
//     } = decrypted;

//     const gstinRegex =
//       /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
//     if (gstin && !gstinRegex.test(gstin)) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Invalid GSTIN format", false));
//     }

//     const encryptedData = {
//       partyName: encryptData(JSON.stringify(partyName))?.encryptedData,
//       gstin: encryptData(JSON.stringify(gstin))?.encryptedData,
//       phoneNumber: encryptData(JSON.stringify(phoneNumber))?.encryptedData,
//       gstType,
//       emailId: encryptData(JSON.stringify(emailId))?.encryptedData,
//       address: {
//         billingAddress: encryptData(JSON.stringify(address?.billingAddress))
//           ?.encryptedData,
//         shippingAddress: encryptData(JSON.stringify(address?.shippingAddress))
//           ?.encryptedData,
//         state: address?.state
//       },
//       creditBalance: {
//         openingBalance: Number(creditBalance?.openingBalance) || 0,
//         asOfDate: new Date(creditBalance?.asOfDate),
//         creditLimitType: creditBalance?.creditLimitType,
//         customCreditLimit: Number(creditBalance?.customCreditLimit) || 0,
//       },
//       additionalFields,
//     };

//     const party = new Party(encryptedData);
//     await party.save();

//     return res
//       .status(200)
//       .json(successResponse(200, "Party created successfully", "", true));
//   } catch (error) {
//     console.error("Create Party Error:", error);
//     return res
//       .status(500)
//       .json(errorResponse(500, "Something went wrong", false));
//   }
// };

export const createParty = async (req, res) => {
  try {
    const user = req.user;
    // const { body } = req.body;
    // const decrypted = JSON.parse(decryptData(body));

    const {
      partyName,
      gstIn,
      phoneNumber,
      gstType,
      panNo,
      emailId,
      address,
      creditBalance,
      additionalFields,
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

    const gstInRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (gstIn && !gstInRegex.test(gstIn)) {
      return res
        .status(400)
        .json(errorResponse(400, "Invalid GSTIN format", false));
    }
    if (phoneNumber) {
      const encryptedPhone = encryptData(phoneNumber)?.encryptedData;
      const existingParty = await Party.findOne({
        phoneNumber: encryptedPhone,
        actionBy,
        userId: user,
      });
      if (existingParty) {
        return res
          .status(400)
          .json(errorResponse(400, "Phone number already exists", false));
      }
    }

    let parsedAsOfDate = null;
    if (creditBalance?.asOfDate) {
      const tempDate = new Date(creditBalance.asOfDate);
      if (!isNaN(tempDate)) {
        parsedAsOfDate = tempDate;
      } else {
        return res
          .status(400)
          .json(errorResponse(400, "Invalid asOfDate format", false));
      }
    }
    const normalizedGstType = gstType
      ?.replace(/\s+/g, " ")
      ?.replace(/[–—−]/g, "-")
      ?.trim();
    const finalStatus = status || "active";
    const encryptedData = {
      userId: user,
      actionBy,
      partyName: encryptData(partyName)?.encryptedData,
      gstIn: encryptData(gstIn)?.encryptedData,
      panNo: encryptData(panNo)?.encryptedData,
      phoneNumber: encryptData(phoneNumber)?.encryptedData,
      gstType: normalizedGstType,
      emailId: encryptData(emailId)?.encryptedData,
      address: {
        billingAddress: encryptData(address?.billingAddress)?.encryptedData,
        shippingAddress: encryptData(address?.shippingAddress)?.encryptedData,
        state: address?.state,
      },
      creditBalance: {
        openingBalance: Number(creditBalance?.openingBalance) || 0,
        asOfDate: parsedAsOfDate,
        creditLimitType: creditBalance?.creditLimitType,
        customCreditLimit: Number(creditBalance?.customCreditLimit) || 0,
      },
      status: finalStatus,
      additionalFields,
    };

    const party = new Party(encryptedData);
    await party.save();

    return res
      .status(200)
      .json(successResponse(200, "Party created successfully", "", true));
  } catch (error) {
    console.error("Create Party Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false));
  }
};

// export const updateParty = async (req, res) => {
//   try {
//     // const { body } = req.body;
//     // const decrypted = JSON.parse(decryptData(body));

//     const {
//       partyName,
//       gstIn,
//       phoneNumber,
//       gstType,
//       emailId,
//       address,
//       creditBalance,
//       additionalFields,
//       status
//     } = req.decryptedBody;

//     const { id } = req.params;

//     const gstInRegex =
//       /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
//     if (gstIn && !gstInRegex.test(gstIn)) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Invalid GSTIN format", false));
//     }

//     const encryptedPhone = encryptData(JSON.stringify(phoneNumber))?.encryptedData;

//     if (phoneNumber) {
//       const existing = await Party.findOne({
//         phoneNumber: encryptedPhone,
//         _id: { $ne: id },
//       });

//       if (existing) {
//         return res
//           .status(400)
//           .json(errorResponse(400, "Phone number already exists", false));
//       }
//     }
//     const encryptedData = {

//       partyName: encryptData(JSON.stringify(partyName))?.encryptedData,
//       gstIn: encryptData(JSON.stringify(gstIn))?.encryptedData,
//       phoneNumber: encryptData(JSON.stringify(phoneNumber))?.encryptedData,
//       gstType,
//       emailId: encryptData(JSON.stringify(emailId))?.encryptedData,
//       address: {
//         billingAddress: encryptData(JSON.stringify(address?.billingAddress))
//           ?.encryptedData,
//         shippingAddress: encryptData(JSON.stringify(address?.shippingAddress))
//           ?.encryptedData,
//         state: address?.state
//       },
//       creditBalance: {
//         openingBalance: Number(creditBalance?.openingBalance) || 0,
//         asOfDate: new Date(creditBalance?.asOfDate),
//         creditLimitType: creditBalance?.creditLimitType,
//         customCreditLimit: Number(creditBalance?.customCreditLimit) || 0,
//       },
//       additionalFields,
//       status: status || "active",
//     };

//     const updatedParty = await Party.findByIdAndUpdate(id, encryptedData, {
//       new: true,
//     });

//     if (!updatedParty) {
//       return res.status(404).json(errorResponse(404, "Party not found", false));
//     }

//     return res
//       .status(200)
//       .json(successResponse(200, "Party updated successfully", "", true));
//   } catch (error) {
//     console.error("Update Party Error:", error);
//     return res
//       .status(500)
//       .json(errorResponse(500, "Something went wrong", false));
//   }
// };

export const updateParty = async (req, res) => {
  try {
    const { id, actionBy } = req.params;
    const {
      partyName,
      gstIn,
      panNo,
      phoneNumber,
      gstType,
      emailId,
      address,
      creditBalance,
      additionalFields,
      status,
    } = req.decryptedBody;

    if (!actionBy) {
      return res
        .status(400)
        .json(
          errorResponse(400, "Missing required parameter: actionBy", false)
        );
    }

    const gstInRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (gstIn && !gstInRegex.test(gstIn)) {
      return res
        .status(400)
        .json(errorResponse(400, "Invalid GSTIN format", false));
    }

    const encryptedPhone = encryptData(phoneNumber)?.encryptedData;

    // if (phoneNumber) {
    //   const existing = await Party.findOne({
    //     phoneNumber: encryptedPhone,
    //     _id: { $ne: id },
    //   });

    //   if (existing) {
    //     return res
    //       .status(400)
    //       .json(errorResponse(400, "Phone number already exists", false));
    //   }
    // }

    // Handle asOfDate safely
    let parsedAsOfDate = null;
    if (creditBalance?.asOfDate) {
      const tempDate = new Date(creditBalance.asOfDate);
      if (!isNaN(tempDate.getTime())) {
        parsedAsOfDate = tempDate;
      }
    }

    const encryptedData = {
      actionBy,
      partyName: encryptData(partyName)?.encryptedData,
      gstIn: encryptData(gstIn)?.encryptedData,
      panNo: encryptData(panNo)?.encryptedData,
      phoneNumber: encryptData(phoneNumber)?.encryptedData,
      gstType,
      emailId: encryptData(emailId)?.encryptedData,
      address: {
        billingAddress: encryptData(address?.billingAddress)?.encryptedData,
        shippingAddress: encryptData(address?.shippingAddress)?.encryptedData,
        state: address?.state,
      },
      creditBalance: {
        openingBalance: Number(creditBalance?.openingBalance) || 0,
        asOfDate: parsedAsOfDate,
        creditLimitType: creditBalance?.creditLimitType,
        customCreditLimit: Number(creditBalance?.customCreditLimit) || 0,
      },
      additionalFields,
      status: status || "active",
    };

    const updatedParty = await Party.findByIdAndUpdate(id, encryptedData, {
      new: true,
    });

    if (!updatedParty) {
      return res.status(404).json(errorResponse(404, "Party not found", false));
    }

    return res
      .status(200)
      .json(successResponse(200, "Party updated successfully", "", true));
  } catch (err) {
    console.error("Update Party Error:", err);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false));
  }
};

export const getAllParties = async (req, res) => {
  try {
    const user = req.user;
    const parties = await Party.find({ userId: user }).populate(
      "actionBy",
      "CompanyName CompanyMobile Companyemail"
    );

    const decryptedParties = parties.map((party) => ({
      _id: party._id,
      partyName: party.partyName ? decryptData(party.partyName) : null,
      gstIn: party.gstIn ? decryptData(party.gstIn) : null,
      phoneNumber: party.phoneNumber ? decryptData(party.phoneNumber) : null,
      gstType: party.gstType ?? null,
      panNo: party.panNo ? decryptData(party.panNo) : null,
      emailId: party.emailId ? decryptData(party.emailId) : null,
      address: {
        billingAddress: party.address?.billingAddress
          ? decryptData(party.address.billingAddress)
          : null,
        shippingAddress: party.address?.shippingAddress
          ? decryptData(party.address.shippingAddress)
          : null,
        state: party.address?.state ?? null,
      },
      creditBalance: {
        openingBalance: party.creditBalance?.openingBalance ?? null,
        asOfDate: party.creditBalance?.asOfDate ?? null,
        creditLimitType: party.creditBalance?.creditLimitType ?? null,
        customCreditLimit: party.creditBalance?.customCreditLimit ?? null,
      },
      additionalFields: party.additionalFields ?? {},
      createdAt: party.createdAt,
      updatedAt: party.updatedAt,
      actionBy: party.actionBy
        ? {
            _id: party.actionBy._id,
            CompanyName: party.actionBy.CompanyName
              ? decryptData(party.actionBy.CompanyName)
              : null,
            CompanyMobile: party.actionBy.CompanyMobile
              ? decryptData(party.actionBy.CompanyMobile)
              : null,
            Companyemail: party.actionBy.Companyemail
              ? decryptData(party.actionBy.Companyemail)
              : null,
          }
        : null,
    }));

    return res
      .status(200)
      .json(
        successResponse(
          200,
          "Parties fetched successfully",
          "",
          true,
          decryptedParties
        )
      );
  } catch (error) {
    console.log("Get Parties Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false, error.message));
  }
};

// export const getOurAllParties = async (req, res) => {
//   try {
//     const user=req.user
//      const { actionBy } = req.params;

//     if (!actionBy) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Missing required parameter: actionBy", false));
//     }

//     const parties = await Party.find({userId:user,actionBy}).populate("actionBy", "CompanyName CompanyMobile Companyemail");

//     const decryptedParties = parties.map((party) => ({
//       _id: party._id,
//       partyName:party.partyName ? decryptData(party.partyName) :null,
//       gstIn: party.gstIn ? decryptData(party.gstIn) : null,
//       panNo: party.panNo ? decryptData(party.panNo) : null,
//       phoneNumber:party.phoneNumber ? decryptData(party.phoneNumber) : null,
//       gstType: party.gstType || null,
//       emailId:party.emailId ? decryptData(party.emailId) : null,
//       address: {
//         billingAddress:party.address?.billingAddress ? decryptData(party.address?.billingAddress) : null,
//         shippingAddress:party.address?.shippingAddress ? decryptData(party.address?.shippingAddress) : null,
//         state: party.address?.state || null,
//       },
//       creditBalance: {
//         openingBalance: party.creditBalance?.openingBalance || null,
//         asOfDate: party.creditBalance?.asOfDate || null,
//         creditLimitType: party.creditBalance?.creditLimitType || null,
//         customCreditLimit: party.creditBalance?.customCreditLimit || null,
//       },
//       additionalFields: party.additionalFields || null,
//       status:party.status,
//       createdAt: party.createdAt,
//       updatedAt: party.updatedAt,
//       actionBy:party.actionBy,
//     }));

//     return res
//       .status(200)
//       .json(
//         successResponse(
//           200,
//           "Parties fetched successfully",
//           "",
//           true,
//           decryptedParties
//         )
//       );
//   } catch (error) {
//     console.log("Get Parties Error:", error);
//     return res
//       .status(500)
//       .json(errorResponse(500, "Something went wrong", false, error.message));
//   }
// };

export const getOurAllParties = async (req, res) => {
  try {
    const { actionBy } = req.params;

    if (!actionBy) {
      return res
        .status(400)
        .json(
          errorResponse(400, "Missing required parameter: actionBy", false)
        );
    }

    const parties = await Party.find({ actionBy }).populate(
      "actionBy",
      "CompanyName CompanyMobile Companyemail"
    );

    const decryptedParties = parties.map((party) => ({
      _id: party._id,
      partyName: party.partyName ? decryptData(party.partyName) : null,
      gstIn: party.gstIn ? decryptData(party.gstIn) : null,
      panNo: party.panNo ? decryptData(party.panNo) : null,
      phoneNumber: party.phoneNumber ? decryptData(party.phoneNumber) : null,
      gstType: party.gstType || null,
      emailId: party.emailId ? decryptData(party.emailId) : null,
      address: {
        billingAddress: party.address?.billingAddress
          ? decryptData(party.address?.billingAddress)
          : null,
        shippingAddress: party.address?.shippingAddress
          ? decryptData(party.address?.shippingAddress)
          : null,
        state: party.address?.state || null,
      },
      creditBalance: {
        openingBalance: party.creditBalance?.openingBalance || null,
        asOfDate: party.creditBalance?.asOfDate || null,
        creditLimitType: party.creditBalance?.creditLimitType || null,
        customCreditLimit: party.creditBalance?.customCreditLimit || null,
      },
      additionalFields: party.additionalFields || null,
      status: party.status,
      createdAt: party.createdAt,
      updatedAt: party.updatedAt,
      actionBy: party.actionBy
        ? {
            _id: party.actionBy._id,
            CompanyName: party.actionBy.CompanyName
              ? decryptData(party.actionBy.CompanyName)
              : null,
            CompanyMobile: party.actionBy.CompanyMobile
              ? decryptData(party.actionBy.CompanyMobile)
              : null,
            Companyemail: party.actionBy.Companyemail
              ? decryptData(party.actionBy.Companyemail)
              : null,
          }
        : null,
    }));

    return res
      .status(200)
      .json(
        successResponse(
          200,
          "Parties fetched successfully",
          "",
          true,
          decryptedParties
        )
      );
  } catch (error) {
    console.log("Get Parties Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false, error.message));
  }
};

export const getPartyById = async (req, res) => {
  try {
    const { id } = req.params;

    const party = await Party.findById(id);

    if (!party) {
      return res.status(404).json(errorResponse(404, "Party not found", false));
    }

    const decryptedParty = {
      _id: party._id,
      partyName: decryptData(party.partyName),
      gstIn: decryptData(party.gstIn),
      phoneNumber: decryptData(party.phoneNumber),
      gstType: party.gstType,
      emailId: decryptData(party.emailId),
      address: {
        billingAddress: decryptData(party.address?.billingAddress),
        shippingAddress: decryptData(party.address?.shippingAddress),
        state: party.address?.state,
      },
      creditBalance: {
        openingBalance: party.creditBalance?.openingBalance,
        asOfDate: party.creditBalance?.asOfDate,
        creditLimitType: party.creditBalance?.creditLimitType,
        customCreditLimit: party.creditBalance?.customCreditLimit,
      },
      additionalFields: party.additionalFields,
    };

    return res
      .status(200)
      .json(
        successResponse(200, "Party fetched successfully", decryptedParty, true)
      );
  } catch (error) {
    console.error("Get Party By ID Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false));
  }
};

export const deleteParty = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Party.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json(errorResponse(404, "Party not found", false));
    }

    return res
      .status(200)
      .json(successResponse(200, "Party deleted successfully", "", true));
  } catch (error) {
    console.error("Delete Party Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false));
  }
};
