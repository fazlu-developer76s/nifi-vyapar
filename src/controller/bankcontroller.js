import Bank from "../models/Bank.js";
import { errorResponse, successResponse } from "../lib/reply.js";
import { encryptData, decryptData } from "../lib/encrypt.js";
import Accounttype from "../models/Accounttype.js";
import Transaction from "../models/transactionBank.js";
import { AdmCompany } from "../models/userAdminCompany.js";



// export const createBank = async (req, res) => {
//   try {
//     const user = req.user;
//     const {
//       accountDisplayName,
//       Balance,
//       asOfDate,
//       accountnumber,
//       ifscCode,
//       upiId,
//       bankName,
//       accountHolderName,
//       branch,
//       upiIdName,
//       status,
//       AccountTypeId,
//     } = req.decryptedBody;

//     const requiredFields = [
//       "accountDisplayName",
//       "accountnumber",
//       "Balance",
//       "asOfDate",
//     ];
//     const missingFields = requiredFields.filter(
//       (field) => !req.decryptedBody[field]
//     );

//     if (missingFields.length > 0) {
//       return res
//         .status(400)
//         .json(
//           errorResponse(
//             400,
//             `Missing required fields: ${missingFields.join(", ")}`,
//             false
//           )
//         );
//     }

//     const encryptedAccountNumber = encryptData(
//       JSON.stringify(accountnumber)
//     )?.encryptedData;
//     const encryptedUpiId = upiId
//       ? encryptData(JSON.stringify(upiId))?.encryptedData
//       : undefined;

//     const existingAccountNumber = await Bank.findOne({
//       accountnumber: encryptedAccountNumber,
//       userId: user,
//     });
//     if (existingAccountNumber) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Account number must be unique", false));
//     }

//     if (upiId) {
//       const existingUpiId = await Bank.findOne({
//         upiId: encryptedUpiId,
//         userId: user,
//       });
//       if (existingUpiId) {
//         return res
//           .status(400)
//           .json(errorResponse(400, "UPI ID must be unique", false));
//       }
//     }
//     const finalStatus = status || active;

//     const newBank = await Bank.create({
//       accountDisplayName: encryptData(JSON.stringify(accountDisplayName))
//         ?.encryptedData,
//       Balance: encryptData(JSON.stringify(Balance))?.encryptedData,
//       asOfDate,
//       accountnumber: encryptedAccountNumber,
//       ifscCode: ifscCode
//         ? encryptData(JSON.stringify(ifscCode))?.encryptedData
//         : undefined,
//       upiId: encryptedUpiId,
//       bankName: bankName
//         ? encryptData(JSON.stringify(bankName))?.encryptedData
//         : undefined,
//       accountHolderName: accountHolderName
//         ? encryptData(JSON.stringify(accountHolderName))?.encryptedData
//         : undefined,
//       branch: branch
//         ? encryptData(JSON.stringify(branch))?.encryptedData
//         : undefined,
//       upiIdName: upiIdName
//         ? encryptData(JSON.stringify(upiIdName))?.encryptedData
//         : undefined,
//       userId: user,
//       AccountTypeId: AccountTypeId || undefined,
//       status: finalStatus,
//     });

//     return res.status(201).json(
//       successResponse(201, "Bank entry created successfully", null, true, {
//         userId: user,
//         id: newBank._id,
//       })
//     );
//   } catch (error) {
//     console.error("Create Bank Error:", error);
//     return res.status(500).json(errorResponse(500, error.message, false));
//   }
// };

// export const createBank = async (req, res) => {
//   try {
//     const user = req.user;
//     const {
//       accountDisplayName,
//       Balance,
//       asOfDate,
//       accountnumber,
//       ifscCode,
//       upiId,
//       bankName,
//       accountHolderName,
//       branch,
//       upiIdName,
//       status,
//       AccountTypeId,
//     } = req.decryptedBody;

    
//     const accountTypeDoc = await Accounttype.findById(AccountTypeId);
//     if (!accountTypeDoc) {
//       return res.status(400).json(errorResponse(400, "Invalid AccountTypeId", false));
//     }

//     const alwaysRequiredFields = ["accountDisplayName", "Balance", "asOfDate"];
    
//     if (accountTypeDoc.type === "bank") {
//       alwaysRequiredFields.push("accountnumber");
//     }

//     const missingFields = alwaysRequiredFields.filter(
//       (field) => !req.decryptedBody[field]
//     );
//     if (missingFields.length > 0) {
//       return res
//         .status(400)
//         .json(
//           errorResponse(
//             400,
//             `Missing required fields: ${missingFields.join(", ")}`,
//             false
//           )
//         );
//     }

//     let finalAccountNumber;
//     const typesWithGeneratedAccountNumber = ["cash", "expense", "others"];

//     if (typesWithGeneratedAccountNumber.includes(accountTypeDoc.type)) {
//       finalAccountNumber = generateRandomAccountNumber();
//     } else if (accountTypeDoc.type === "bank") {
//       finalAccountNumber = accountnumber;
//     } else {
//       return res.status(400).json(
//         errorResponse(400, `Unsupported account type: ${accountTypeDoc.type}`, false)
//       );
//     }

    
//     const encryptedAccountNumber = encryptData(finalAccountNumber)?.encryptedData;
  
//     const encryptedUpiId = upiId
//       ? encryptData(upiId)?.encryptedData
//       : undefined;


//     const existingAccountNumber = await Bank.findOne({
//       accountnumber: encryptedAccountNumber,
//       userId: user,
//     });
//     if (existingAccountNumber) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Account number must be unique", false));
//     }

   
//     if (upiId) {
//       const existingUpiId = await Bank.findOne({
//         upiId: encryptedUpiId,
//         userId: user,
//       });
//       if (existingUpiId) {
//         return res
//           .status(400)
//           .json(errorResponse(400, "UPI ID must be unique", false));
//       }
//     }

//     const finalStatus = status || "active";

//     const newBank = await Bank.create({
//       accountDisplayName: encryptData(accountDisplayName)?.encryptedData,
//       Balance: encryptData(Balance)?.encryptedData,
//       asOfDate,
//       accountnumber: encryptedAccountNumber,
//       ifscCode: ifscCode
//         ? encryptData(ifscCode)?.encryptedData
//         : undefined,
//       upiId: encryptedUpiId,
//       bankName: bankName
//         ? encryptData(bankName)?.encryptedData
//         : undefined,
//       accountHolderName: accountHolderName
//         ? encryptData(accountHolderName)?.encryptedData
//         : undefined,
//       branch: branch
//         ? encryptData(branch)?.encryptedData
//         : undefined,
//       upiIdName: upiIdName
//         ? encryptData(upiIdName)?.encryptedData
//         : undefined,
//       userId: user,
//       AccountTypeId: AccountTypeId || undefined,
//       status: finalStatus,
//     });

//     return res.status(201).json(
//       successResponse(201, "Bank entry created successfully", null, true, {
//         userId: user,
//         id: newBank._id,
//       })
//     );
//   } catch (error) {
//     console.error("Create Bank Error:", error);
//     return res.status(500).json(errorResponse(500, error.message, false));
//   }
// };


export const createBank = async (req, res) => {
  try {
   const user=req.user
    const {
      accountDisplayName,
      Balance,
      asOfDate,
      accountnumber,
      ifscCode,
      upiId,
      bankName,
      accountHolderName,
      branch,
      upiIdName,
      status,
      AccountTypeId,
      actionBy
    } = req.decryptedBody;

 const company = await AdmCompany.find({actionBy,userId:user});
    if (!company) {
      return res
        .status(404)
        .json(errorResponse(404, "Company not found with provided actionBy", false));
    }




    // const accountTypeDoc = await Accounttype.find({AccountTypeId,userId:user});
    const accountTypeDoc = await Accounttype.findOne({ _id: AccountTypeId, userId: user });
    if (!accountTypeDoc) {
      return res.status(400).json(errorResponse(400, "Invalid AccountTypeId", false));
    }

    const typeLower = accountTypeDoc.type?.toLowerCase();

    const alwaysRequiredFields = ["accountDisplayName", "Balance", "asOfDate"];
    if (typeLower === "bank") {
      alwaysRequiredFields.push("accountnumber");
    }

    const missingFields = alwaysRequiredFields.filter(
      (field) => !req.decryptedBody[field]
    );
    if (missingFields.length > 0) {
      return res.status(400).json(
        errorResponse(400, `Missing required fields: ${missingFields.join(", ")}`, false)
      );
    }

    let finalAccountNumber;
    if (typeLower === "bank") {
      finalAccountNumber = accountnumber;
    } else {
      finalAccountNumber = generateRandomAccountNumber();
    }

    const encryptedAccountNumber = encryptData(finalAccountNumber)?.encryptedData;
    const encryptedUpiId = upiId ? encryptData(upiId)?.encryptedData : undefined;

    const existingAccountNumber = await Bank.findOne({
      accountnumber: encryptedAccountNumber,
      actionBy,
      userId:user
    });
    if (existingAccountNumber) {
      return res
        .status(400)
        .json(errorResponse(400, "Account number must be unique", false));
    }

    if (upiId) {
      const existingUpiId = await Bank.findOne({
        upiId: encryptedUpiId,
        actionBy,
        userId:user
      });
      if (existingUpiId) {
        return res
          .status(400)
          .json(errorResponse(400, "UPI ID must be unique", false));
      }
    }

    const finalStatus = status || "active";

    const newBank = await Bank.create({
      accountDisplayName: encryptData(accountDisplayName)?.encryptedData,
      Balance: encryptData(Balance)?.encryptedData,
      asOfDate,
      accountnumber: encryptedAccountNumber,
      ifscCode: ifscCode ? encryptData(ifscCode)?.encryptedData : undefined,
      upiId: encryptedUpiId,
      bankName: bankName ? encryptData(bankName)?.encryptedData : undefined,
      accountHolderName: accountHolderName
        ? encryptData(accountHolderName)?.encryptedData
        : undefined,
      branch: branch ? encryptData(branch)?.encryptedData : undefined,
      upiIdName: upiIdName ? encryptData(upiIdName)?.encryptedData : undefined,
      actionBy,
      userId:user,
      AccountTypeId: AccountTypeId || undefined,
      status: finalStatus,
    });

    await Transaction.create({
      type: "credit",
  bankId: newBank._id,
  userId:user,
  actionBy,
  refNo: `OPEN-${Date.now()}`,
  amount: encryptData(Balance.toString())?.encryptedData,
  Balance: encryptData(Balance.toString())?.encryptedData,
  closingBalance: encryptData(Balance.toString())?.encryptedData,
  remark: "Opening balance",
  description: "Initial balance when account was created",
date: new Date(asOfDate || Date.now()).toISOString(),
status: "success",
userId:user
    });

    return res.status(201).json(
      successResponse(201, "Bank entry and opening transaction created successfully", null, true, {
        actionBy,
        id: newBank._id,
      })
    );
  } catch (error) {
    console.error("Create Bank Error:", error);
    return res.status(500).json(errorResponse(500, error.message, false));
  }
};



export const getAllBanks = async (req, res) => {
  try {
    const user=req.user
    const banks = await Bank.find({userId:user});

    const decryptedBanks = banks.map((bank) => ({
      id: bank._id,
      accountDisplayName: bank.accountDisplayName ? decryptData(bank.accountDisplayName) : null,
      Balance: bank.Balance ? decryptData(bank.Balance) : null,
      asOfDate: bank.asOfDate ?? null,
      accountnumber: bank.accountnumber ? decryptData(bank.accountnumber) : null,
      ifscCode: bank.ifscCode ? decryptData(bank.ifscCode) : null,
      upiId: bank.upiId ? decryptData(bank.upiId) : null,
      bankName: bank.bankName ? decryptData(bank.bankName) : null,
      accountHolderName: bank.accountHolderName ? decryptData(bank.accountHolderName) : null,
      branch: bank.branch ? decryptData(bank.branch) : null,
      upiIdName: bank.upiIdName ? decryptData(bank.upiIdName) : null,
      status: bank.status || null,
      AccountTypeId: bank.AccountTypeId || null,
      actionBy: bank.actionBy || null,
      createdAt: bank.createdAt,
      updatedAt: bank.updatedAt,
    }));

    return res.status(200).json(
      successResponse(200, "Banks fetched successfully", "", true, decryptedBanks)
    );
  } catch (error) {
    console.error("Get All Banks Error:", error);
    return res.status(500).json(errorResponse(500, error.message, false));
  }
};



export const getOurAllBanks = async (req, res) => {
  try {
    const user = req.user;
    console.log(user, "user");

    const { actionBy } = req.params;
    console.log(actionBy, "actionBy");

    if (!actionBy) {
      return res
        .status(400)
        .json(errorResponse(400, "Missing required parameter: actionBy", false));
    }



    const banks = await Bank.find({ actionBy, userId: user })
      .populate("AccountTypeId")
      .populate({
        path: "actionBy",
        select: "CompanyName CompanyMobile Companyemail",
        model: "AdmCompany",
      });

  

    const decryptedBanks = banks.map((bank) => ({
      id: bank._id,
      accountDisplayName: bank.accountDisplayName ? decryptData(bank.accountDisplayName) : null,
      accountnumber: bank.accountnumber ? decryptData(bank.accountnumber) : null,
      Balance: bank.Balance ? decryptData(bank.Balance) : null,
      asOfDate: bank.asOfDate ?? null,
      ifscCode: bank.ifscCode ? decryptData(bank.ifscCode) : null,
      upiId: bank.upiId ? decryptData(bank.upiId) : null,
      bankName: bank.bankName ? decryptData(bank.bankName) : null,
      accountHolderName: bank.accountHolderName ? decryptData(bank.accountHolderName) : null,
      branch: bank.branch ? decryptData(bank.branch) : null,
      upiIdName: bank.upiIdName ? decryptData(bank.upiIdName) : null,
      AccountTypeId: bank.AccountTypeId || null,
      status: bank.status || null,
      actionBy: bank.actionBy
        ? {
            _id: bank.actionBy._id,
            CompanyName: bank.actionBy.CompanyName ? decryptData(bank.actionBy.CompanyName) : null,
            CompanyMobile: bank.actionBy.CompanyMobile ? decryptData(bank.actionBy.CompanyMobile) : null,
            Companyemail: bank.actionBy.Companyemail ? decryptData(bank.actionBy.Companyemail) : null,
          }
        : null,
    }));

    return res.status(200).json(
      successResponse(200, "Banks fetched successfully", null, true, decryptedBanks)
    );
  } catch (error) {
    console.error("Get Banks Error:", error);
    return res.status(500).json(errorResponse(500, error.message, false));
  }
};


// export const updateBank = async (req, res) => {
//   try {
//     const user = req.user;
//     const id = req.params;
//     const {
//       accountDisplayName,
//       Balance,
//       asOfDate,
//       accountnumber,
//       ifscCode,
//       upiId,
//       bankName,
//       accountHolderName,
//       branch,
//       upiIdName,
//       status
//     } = req.decryptedBody;

//     const existingBank = await Bank.findOne({ _id:id, userId: user });
//     if (!existingBank) {
//       return res.status(404).json(errorResponse(404, "Bank entry not found", false));
//     }

//     const updateFields = {};

//     if (accountDisplayName) {
//       updateFields.accountDisplayName = encryptData(JSON.stringify(accountDisplayName))?.encryptedData;
//     }

//     if (Balance) {
//       updateFields.Balance = encryptData(JSON.stringify(Balance))?.encryptedData;
//     }

//     if (asOfDate) {
//       updateFields.asOfDate = asOfDate;
//     }

//     if (accountnumber) {
//       const encryptedAccountNumber = encryptData(JSON.stringify(accountnumber))?.encryptedData;

//       const duplicateAccount = await Bank.findOne({
//         accountnumber: encryptedAccountNumber,
//         userId: user,
//         _id: { $ne:id  },
//       });
//       if (duplicateAccount) {
//         return res.status(400).json(errorResponse(400, "Account number must be unique", false));
//       }

//       updateFields.accountnumber = encryptedAccountNumber;
//     }

//     if (upiId) {
//       const encryptedUpiId = encryptData(JSON.stringify(upiId))?.encryptedData;

//       const duplicateUpi = await Bank.findOne({
//         upiId: encryptedUpiId,
//         userId: user,
//         _id: { $ne: id },
//       });
//       if (duplicateUpi) {
//         return res.status(400).json(errorResponse(400, "UPI ID must be unique", false));
//       }

//       updateFields.upiId = encryptedUpiId;
//     }

//     if (ifscCode) {
//       updateFields.ifscCode = encryptData(JSON.stringify(ifscCode))?.encryptedData;
//     }

//     if (bankName) {
//       updateFields.bankName = encryptData(JSON.stringify(bankName))?.encryptedData;
//     }

//     if (accountHolderName) {
//       updateFields.accountHolderName = encryptData(JSON.stringify(accountHolderName))?.encryptedData;
//     }

//     if (branch) {
//       updateFields.branch = encryptData(JSON.stringify(branch))?.encryptedData;
//     }

//     if (upiIdName) {
//       updateFields.upiIdName = encryptData(JSON.stringify(upiIdName))?.encryptedData;
//     }

//     if (status !== undefined) {
//       updateFields.status = status;
//     }

//     const updatedBank = await Bank.findByIdAndUpdate(id, updateFields, { new: true });

//     return res.status(200).json(
//       successResponse(200, "Bank entry updated successfully", null, true, {
//         userId: user,
//         id: updatedBank._id,
//       })
//     );
//   } catch (error) {
//     console.error("Update Bank Error:", error);
//     return res.status(500).json(errorResponse(500, error.message, false));
//   }
// };

// export const updateBank = async (req, res) => {
//   try {
//     const user = req.user;
//     const { id } = req.params; // ✅ Correctly extracting 'id' from req.params

//     const {
//       accountDisplayName,
//       Balance,
//       asOfDate,
//       accountnumber,
//       ifscCode,
//       upiId,
//       bankName,
//       accountHolderName,
//       branch,
//       upiIdName,
//       status
//     } = req.decryptedBody;

//     const existingBank = await Bank.findOne({ _id: id, userId: user });
//     if (!existingBank) {
//       return res.status(404).json(errorResponse(404, "Bank entry not found", false));
//     }

//     const updateFields = {};

//     if (accountDisplayName) {
//       updateFields.accountDisplayName = encryptData(JSON.stringify(accountDisplayName))?.encryptedData;
//     }

//     if (Balance) {
//       updateFields.Balance = encryptData(JSON.stringify(Balance))?.encryptedData;
//     }

//     if (asOfDate) {
//       updateFields.asOfDate = asOfDate;
//     }

//     if (accountnumber) {
//       const encryptedAccountNumber = encryptData(JSON.stringify(accountnumber))?.encryptedData;

//       const duplicateAccount = await Bank.findOne({
//         accountnumber: encryptedAccountNumber,
//         userId: user,
//         _id: { $ne: id },
//       });
//       if (duplicateAccount) {
//         return res.status(400).json(errorResponse(400, "Account number must be unique", false));
//       }

//       updateFields.accountnumber = encryptedAccountNumber;
//     }

//     if (upiId) {
//       const encryptedUpiId = encryptData(JSON.stringify(upiId))?.encryptedData;

//       const duplicateUpi = await Bank.findOne({
//         upiId: encryptedUpiId,
//         userId: user,
//         _id: { $ne: id },
//       });
//       if (duplicateUpi) {
//         return res.status(400).json(errorResponse(400, "UPI ID must be unique", false));
//       }

//       updateFields.upiId = encryptedUpiId;
//     }

//     if (ifscCode) {
//       updateFields.ifscCode = encryptData(JSON.stringify(ifscCode))?.encryptedData;
//     }

//     if (bankName) {
//       updateFields.bankName = encryptData(JSON.stringify(bankName))?.encryptedData;
//     }

//     if (accountHolderName) {
//       updateFields.accountHolderName = encryptData(JSON.stringify(accountHolderName))?.encryptedData;
//     }

//     if (branch) {
//       updateFields.branch = encryptData(JSON.stringify(branch))?.encryptedData;
//     }

//     if (upiIdName) {
//       updateFields.upiIdName = encryptData(JSON.stringify(upiIdName))?.encryptedData;
//     }

//     if (status !== undefined) {
//       updateFields.status = status;
//     }

//     const updatedBank = await Bank.findByIdAndUpdate(id, updateFields, { new: true });

//     return res.status(200).json(
//       successResponse(200, "Bank entry updated successfully", null, true, {
//         userId: user,
//         id: updatedBank._id,
//       })
//     );
//   } catch (error) {
//     console.error("Update Bank Error:", error);
//     return res.status(500).json(errorResponse(500, error.message, false));
//   }
// };


export const updateBank = async (req, res) => {
  try {
    const{actionBy,bankId}=req.params
  
    const {
      accountDisplayName,
      Balance,
      asOfDate,
      accountnumber,
      ifscCode,
      upiId,
      bankName,
      accountHolderName,
      branch,
      upiIdName,
      status,
      AccountTypeId,
    } = req.decryptedBody;


    const existingBank = await Bank.findById(bankId);
    if (!existingBank) {
      return res.status(404).json(errorResponse(404, "Bank record not found", false));
    }
 
 if (!actionBy) {
      return res
        .status(400)
        .json(errorResponse(400, "Missing required parameter: actionBy", false));
    }

    if (AccountTypeId) {
      const accountTypeDoc = await Accounttype.findById(AccountTypeId);
      if (!accountTypeDoc) {
        return res.status(400).json(errorResponse(400, "Invalid AccountTypeId", false));
      }
    }

    const accountTypeDoc = AccountTypeId
      ? await Accounttype.findById(AccountTypeId)
      : await Accounttype.findById(existingBank.AccountTypeId);

    const typeLower = accountTypeDoc?.type?.toLowerCase();

    const alwaysRequiredFields = ["accountDisplayName", "Balance", "asOfDate"];
    if (typeLower === "bank") {
      alwaysRequiredFields.push("accountnumber");
    }

 
    const missingFields = alwaysRequiredFields.filter(
      (field) => req.decryptedBody[field] === undefined && existingBank[field] === undefined
    );
    if (missingFields.length > 0) {
      return res.status(400).json(
        errorResponse(400, `Missing required fields: ${missingFields.join(", ")}`, false)
      );
    }

    const updatedData = {};

    if (accountDisplayName !== undefined) {
      updatedData.accountDisplayName = encryptData(accountDisplayName)?.encryptedData;
    }

    if (Balance !== undefined) {
      updatedData.Balance = encryptData(Balance)?.encryptedData;
    }

    if (asOfDate !== undefined) {
      updatedData.asOfDate = asOfDate;
    }

    if (ifscCode !== undefined) {
      updatedData.ifscCode = ifscCode ? encryptData(ifscCode)?.encryptedData : undefined;
    }

    if (bankName !== undefined) {
      updatedData.bankName = bankName ? encryptData(bankName)?.encryptedData : undefined;
    }

    if (accountHolderName !== undefined) {
      updatedData.accountHolderName = accountHolderName
        ? encryptData(accountHolderName)?.encryptedData
        : undefined;
    }

    if (branch !== undefined) {
      updatedData.branch = branch ? encryptData(branch)?.encryptedData : undefined;
    }

    if (upiIdName !== undefined) {
      updatedData.upiIdName = upiIdName ? encryptData(upiIdName)?.encryptedData : undefined;
    }

    if (status !== undefined) {
      updatedData.status = status;
    }

    if (AccountTypeId !== undefined) {
      updatedData.AccountTypeId = AccountTypeId;
    }

    // Handle accountnumber & upiId uniqueness & encryption
    if (typeLower === "bank") {
      if (!accountnumber) {
        return res.status(400).json(errorResponse(400, "accountnumber is required for bank type", false));
      }
      // Check if accountnumber changed and uniqueness
      if (accountnumber !== undefined) {
        const encryptedAccountNumber = encryptData(accountnumber)?.encryptedData;

        if (encryptedAccountNumber !== existingBank.accountnumber) {
          const existingAccountNumber = await Bank.findOne({
            accountnumber: encryptedAccountNumber,
            actionBy: companyId,
            _id: { $ne: bankId },
          });
          if (existingAccountNumber) {
            return res.status(400).json(errorResponse(400, "Account number must be unique", false));
          }
          updatedData.accountnumber = encryptedAccountNumber;
        }
      }
    } else {
      // Non-bank type: generate random account number only if accountnumber provided?
      if (accountnumber !== undefined) {
        updatedData.accountnumber = encryptData(accountnumber || generateRandomAccountNumber())?.encryptedData;
      }
    }

    if (upiId !== undefined) {
      const encryptedUpiId = upiId ? encryptData(upiId)?.encryptedData : undefined;
      if (encryptedUpiId !== existingBank.upiId) {
        const existingUpiId = await Bank.findOne({
          upiId: encryptedUpiId,
          actionBy,
          _id: { $ne: bankId },
        });
        if (existingUpiId) {
          return res.status(400).json(errorResponse(400, "UPI ID must be unique", false));
        }
        updatedData.upiId = encryptedUpiId;
      }
    }

    updatedData.actionBy ;
    

    const updatedBank = await Bank.findByIdAndUpdate(bankId, updatedData, { new: true });


    return res.status(200).json(
      successResponse(200, "Bank record updated successfully", null, true, {
        actionBy,
        id: updatedBank._id,
      })
    );
  } catch (error) {
    console.error("Update Bank Error:", error);
    return res.status(500).json(errorResponse(500, error.message, false));
  }
};




export const deleteBank = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Bank.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json(errorResponse(404, "Bank entry not found", false));
    }

    return res
      .status(200)
      .json(successResponse(200, "Bank entry deleted successfully", "", true));
  } catch (error) {
    console.error("Delete Bank Error:", error);
    return res.status(500).json(errorResponse(500, error.message, false));
  }
};


function generateRandomAccountNumber() {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}