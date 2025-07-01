import { decryptData } from "../lib/encrypt.js";
import { errorResponse, successResponse } from "../lib/reply.js";
import Accounttype from "../models/Accounttype.js";
import { AdmCompany } from "../models/userAdminCompany.js";

// export const createAccountType = async (req, res) => {
//   const user = req.user;

//   try {
//     const { type } = req.decryptedBody;
//     const allowedTypes = ["bank", "cash", "other", "expense"];

//     const normalizedType = type.toLowerCase();

//     if (!allowedTypes.includes(normalizedType)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid account type. Allowed: bank, cash, other, expense",
//       });
//     }

//     const existing = await Accounttype.findOne({ userId: user, type: normalizedType });
//     if (existing) {
//       return res.status(400).json(errorResponse(400, "Account type already exists for this user", false));
      
//     }

//     const newAccountType = await Accounttype.create({
//       type: normalizedType,
//       userId: user,
//     });

//     res.status(201).json(
//       successResponse(201, "Account type created", null, true, newAccountType)
//     );
//   } catch (err) {
//     if (err.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: "Duplicate account type for this user",
//       });
//     }

//     console.error(err);
//     res.status(500).json(errorResponse(500, "Something went wrong", false));
//   }
// };



// export const createAccountType = async (req, res) => {
  
//       try {
      
//     const { type , actionBy} = req.decryptedBody;
    

//     if (!type || typeof type !== "string" || !type.trim()) {
//       return res.status(400).json({
//         success: false,
//         message: "Account type is required and must be a valid string.",
//       });
//     }
//  const company = await AdmCompany.findById(actionBy);
//     if (!company) {
//       return res
//         .status(404)
//         .json(errorResponse(404, "Company not found with provided actionBy", false));
//     }

//     const normalizedType = type.trim().toLowerCase();

//     const existing = await Accounttype.findOne({
//       type: normalizedType,
//       actionBy,
      
//     });

//     if (existing) {
//       return res.status(400).json(
//         errorResponse(400, "This account type already exists for the company.", false)
//       );
//     }

//     const newAccountType = await Accounttype.create({
//       type: normalizedType,
//       actionBy,
     
//     });

//     return res.status(201).json(
//       successResponse(201, "Account type created successfully", null, true, newAccountType)
//     );
//   } catch (err) {
//     if (err.code === 11000) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Duplicate account type for this company", false));
//     }

//     console.error("Create AccountType Error:", err);
//     return res.status(500).json(errorResponse(500, "Something went wrong", false));
//   }
// };

export const createAccountType = async (req, res) => {
  try {
    const { type, actionBy } = req.decryptedBody;
    const user = req.user; 

  
    if (!type || typeof type !== "string" || !type.trim()) {
      return res.status(400).json({
        success: false,
        message: "Account type is required and must be a valid string.",
      });
    }

    const company = await AdmCompany.findOne({ _id: actionBy, userId: user });
    if (!company) {
      return res
        .status(404)
        .json(errorResponse(404, "Company not found or unauthorized", false));
    }

    const normalizedType = type.trim().toLowerCase();

  
    const existing = await Accounttype.findOne({
      type: normalizedType,
      actionBy,
      userId:user
      
    });

    if (existing) {
      return res
        .status(400)
        .json(errorResponse(400, "This account type already exists for the company.", false));
    }

    const newAccountType = await Accounttype.create({
      type: normalizedType,
      actionBy,
      userId:user, 
    });

    return res.status(201).json(
      successResponse(201, "Account type created successfully", null, true, newAccountType)
    );
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json(errorResponse(400, "Duplicate account type for this company", false));
    }

    console.error("Create AccountType Error:", err);
    return res.status(500).json(errorResponse(500, "Something went wrong", false));
  }
};


export const getAllAccountTypes = async (req, res) => {
  try {
    const user = req.user

    const {actionBy}=req.params

   if (!actionBy) {
      return res
        .status(400)
        .json(errorResponse(400, "Missing required parameter: actionBy", false));
    }
  const accountTypes = await Accounttype.find({ actionBy,userId:user})
      .populate({
        path: "actionBy",
        select: "CompanyName CompanyMobile Companyemail",
        model: "AdmCompany",
      });

    const decryptedAccountTypes = accountTypes.map((acc) => ({
      id: acc._id,
       type: acc.type,  
       userId:user,
      actionBy: acc.actionBy
        ? {
            _id: acc.actionBy._id,
            CompanyName: acc.actionBy.CompanyName ? decryptData(acc.actionBy.CompanyName) : null,
            CompanyMobile: acc.actionBy.CompanyMobile ? decryptData(acc.actionBy.CompanyMobile) : null,
            Companyemail: acc.actionBy.Companyemail ? decryptData(acc.actionBy.Companyemail) : null,
          }
        : null,
    }));

    return res.status(200).json(
      successResponse(200, "Successfully fetched all account types", null, true, decryptedAccountTypes)
    );
  } catch (err) {
    console.error("Get Account Types Error:", err);
    res.status(500).json(errorResponse(500, "Something went wrong", false));
  }
};


export const getAccountTypeById = async (req, res) => {
  try {
    const user = req.user;
    const id = req.params.id;

    const accountType = await Accounttype.findOne({ _id: id, userId: user });

    if (!accountType) {
      return res
        .status(404)
        .json(errorResponse(404, "Account type not found", false));
    }

    return res
      .status(200)
      .json(
        successResponse(200, "Successfully retrieved account type", null, true, accountType)
      );
  } catch (err) {
    console.error("Get Account Type By ID Error:", err);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false));
  }
};


// export const updateAccountType = async (req, res) => {
//   const user = req.user; // Ensure you have user from auth middleware

//   try {
//     const { type } = req.decryptedBody;
//     const { id } = req.params;

//     const allowedTypes = ["cash", "expense", "other", "bank"];
//     const normalizedType = type.toLowerCase();

//     if (!allowedTypes.includes(normalizedType)) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Invalid account type value", false));
//     }

//     const accountType = await Accounttype.findById(id);

//     if (!accountType) {
//       return res
//         .status(404)
//         .json(errorResponse(404, "Account type not found", false));
//     }

//     // Check ownership
//     if (accountType.userId.toString() !== user.toString()) {
//       return res
//         .status(403)
//         .json(errorResponse(403, "Unauthorized to update this type", false));
//     }

//     // Prevent duplicate type for the same user
//     const existing = await Accounttype.findOne({
//       userId: user,
//       type: normalizedType,
//       _id: { $ne: id },
//     });

//     if (existing) {
//       return res.status(400).json(
//         errorResponse(400, "This type already exists for the user", false)
//       );
//     }

//     accountType.type = normalizedType;
//     await accountType.save();

//     res.status(200).json(
//       successResponse(200, "Account type updated", null, true, accountType)
//     );
//   } catch (err) {
//     console.error(err);
//     res
//       .status(500)
//       .json(errorResponse(500, "Something went wrong", false));
//   }
// };


export const updateAccountType = async (req, res) => {
 

  try {
   const { id ,actionBy} = req.params;
    const { type } = req.decryptedBody;

    if (!type || typeof type !== "string" || !type.trim()) {
      return res.status(400).json({
        success: false,
        message: "Account type is required and must be a valid string.",
      });
    }

    if (!actionBy) {
      return res
        .status(400)
        .json(errorResponse(400, "Missing required parameter: actionBy", false));
    }
    const normalizedType = type.trim().toLowerCase();

    const duplicate = await Accounttype.findOne({
      type: normalizedType,
      actionBy,
      _id: { $ne: id }, 
    });

    if (duplicate) {
      return res.status(400).json(
        errorResponse(400, "This account type already exists for the company.", false)
      );
    }
    const updated = await Accounttype.findOneAndUpdate(
      { _id: id, actionBy },
      { type: normalizedType },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json(
        errorResponse(404, "Account type not found or not authorized.", false)
      );
    }
    return res.status(200).json(
      successResponse(200, "Account type updated successfully", null, true, updated)
    );
  } catch (err) {
    console.error("Update AccountType Error:", err);
    return res.status(500).json(errorResponse(500, "Something went wrong", false));
  }
};



export const deleteAccountType = async (req, res) => {
  try {
    const deleted = await Accounttype.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json(errorResponse(404, "Not found", false));

    res.status(200).json(successResponse(200, "Deleted", null, true));
  } catch (err) {
    res.status(500).json(errorResponse(500, "something went wrong", false));
  }
};
