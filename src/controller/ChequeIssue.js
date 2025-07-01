import IssuedCheque from "../models/issuecheque.js";
import Cheque from "../models/Cheque.js";
import { decryptData, encryptData } from "../lib/encrypt.js";
import { errorResponse, successResponse } from "../lib/reply.js";
import Bank from "../models/Bank.js";
import Transaction from "../models/transactionBank.js"; 
import Party from "../models/Party.js";
import { Company } from "../models/Company.js";
import mongoose from "mongoose";

export const getIssuedCheques = async (req, res) => {
  try {
    const user = req.user;

    const issuedCheques = await IssuedCheque.find({ userId: user })
      .populate({
        path: "chequeSerialNumber",
        select: "chequeSerialNumber from to numberOfLeaves status bankId",
        populate: {
          path: "bankId",
          select: "_id bankName",
        },
      })
      .populate({
        path: "party",
        select: "_id partyName",
      })
      .populate({
        path: "toBankAccount",
        select: "_id accountnumber bankName",
      });

    const result = issuedCheques.map((entry) => {
      const cheque = entry.chequeSerialNumber;

      const toBankData = entry.toBankAccount || null;
      const decryptedToBank = toBankData
        ? {
            _id: toBankData._id,
            accountnumber: toBankData.accountnumber
              ? decryptData(toBankData.accountnumber)
              : null,
            bankName: toBankData.bankName
              ? decryptData(toBankData.bankName)
              : null,
          }
        : null;

      return {
        _id: entry._id,
        issueDate: entry.issueDate || null,
        issuedBy: entry.issuedBy ? decryptData(entry.issuedBy) : null,
        amount: entry.amount ? decryptData(entry.amount) : null,
        remarks: entry.remarks ? decryptData(entry.remarks) : null,
        status: entry.status || null,
        type: entry.type || null,
        payee: entry.payee || null,

        party: entry.party?._id || null,
        partyName: entry.party?.partyName
          ? decryptData(entry.party.partyName)
          : null,

        toBankAccount: decryptedToBank,

        chequeDetails: cheque
          ? {
              _id: cheque._id || null,
              chequeSerialNumber: cheque.chequeSerialNumber
                ? decryptData(cheque.chequeSerialNumber)
                : null,
              from: cheque.from ? decryptData(cheque.from) : null,
              to: cheque.to ? decryptData(cheque.to) : null,
              numberOfLeaves: cheque.numberOfLeaves
                ? decryptData(cheque.numberOfLeaves)
                : null,
              status: cheque.status || null,
              bankName: cheque.bankId?.bankName
                ? decryptData(cheque.bankId.bankName)
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
          "Issued cheques fetched successfully",
          null,
          true,
          result
        )
      );
  } catch (error) {
    console.error("Get All Issued Cheques Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, error.message || "Server error", false));
  }
};

export const getttIssuedCheques = async (req, res) => {
  try {
    const userId = req.user;
    const { bankId, actionBy } = req.query;

    const filter = { userId };

    if (actionBy) {
      if (!mongoose.Types.ObjectId.isValid(actionBy)) {
        return res
          .status(400)
          .json(errorResponse(400, "Invalid actionBy ObjectId", false));
      }
      filter.actionBy = actionBy;
    }

    if (bankId && !mongoose.Types.ObjectId.isValid(bankId)) {
      return res
        .status(400)
        .json(errorResponse(400, "Invalid bankId ObjectId", false));
    }

    const issuedCheques = await IssuedCheque.find(filter)
      .populate({
        path: "chequeSerialNumber",
        match: bankId ? { bankId } : {}, // filter inside chequeSerialNumber if bankId is given
        select: "chequeSerialNumber from to numberOfLeaves status bankId",
        populate: {
          path: "bankId",
          select:
            "_id bankName accountnumber ifscCode branch accountDisplayName",
        },
      })
      .populate({
        path: "party",
        select: "_id partyName",
      })
      .populate({
        path: "toBankAccount",
        select: "_id accountnumber bankName",
      })
      .lean();

    // Filter out entries with no chequeSerialNumber (due to match)
    const result = issuedCheques
      .filter((entry) => entry.chequeSerialNumber)
      .map((entry) => {
        const cheque = entry.chequeSerialNumber;

        const toBankData = entry.toBankAccount || null;
        const decryptedToBank = toBankData
          ? {
              _id: toBankData._id,
              accountnumber: toBankData.accountnumber
                ? decryptData(toBankData.accountnumber)
                : null,
              bankName: toBankData.bankName
                ? decryptData(toBankData.bankName)
                : null,
            }
          : null;

        const decryptedCheque = cheque
          ? {
              _id: cheque._id,
              chequeSerialNumber: cheque.chequeSerialNumber
                ? decryptData(cheque.chequeSerialNumber)
                : null,
              from: cheque.from ? decryptData(cheque.from) : null,
              to: cheque.to ? decryptData(cheque.to) : null,
              numberOfLeaves: cheque.numberOfLeaves
                ? decryptData(cheque.numberOfLeaves)
                : null,
              status: cheque.status || null,
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
            }
          : null;

        return {
          _id: entry._id,
          issueDate: entry.issueDate || null,
          issuedBy: entry.issuedBy ? decryptData(entry.issuedBy) : null,
          amount: entry.amount ? decryptData(entry.amount) : null,
          remarks: entry.remarks ? decryptData(entry.remarks) : null,
          status: entry.status || null,
          type: entry.type || null,
          payee: entry.payee || null,
          party: entry.party?._id || null,
          partyName: entry.party?.partyName
            ? decryptData(entry.party.partyName)
            : null,
          toBankAccount: decryptedToBank,
          chequeDetails: decryptedCheque,
        };
      });

    return res
      .status(200)
      .json(
        successResponse(
          200,
          "Issued cheques fetched successfully",
          null,
          true,
          result
        )
      );
  } catch (error) {
    console.error("Get All Issued Cheques Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, error.message || "Server error", false));
  }
};

export const deleteIssuedCheque = async (req, res) => {
  try {
    const { issuedChequeId } = req.params;

    console.log(issuedChequeId);
    if (!issuedChequeId) {
      return res
        .status(400)
        .json(
          errorResponse(400, "issuedChequeId is required in params", false)
        );
    }

    const issuedCheque = await IssuedCheque.findOne({
      _id: issuedChequeId,
    });

    if (!issuedCheque) {
      return res
        .status(404)
        .json(errorResponse(404, "Issued cheque not found", false));
    }

    const cheque = await Cheque.findOne({
      _id: issuedCheque.chequeSerialNumber,
    });

    if (cheque && cheque.status === "used") {
      cheque.status = "unused";
      await cheque.save();
    }

    await issuedCheque.deleteOne();

    return res
      .status(200)
      .json(successResponse(200, "Issued cheque deleted successfully", null));
  } catch (error) {
    console.error("DeleteIssuedCheque Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, error.message || "Server error", false));
  }
};

export const CreateissueCheque = async (req, res) => {
  try {
    const user = req.user;

    const {
      chequeSerialNumber,
      issueDate,
      issuedBy,
      payee,
      party,
      amount,
      remarks,
      toBankAccount,
      actionBy,
    } = req.decryptedBody;

    if (!chequeSerialNumber || !amount) {
      return res
        .status(400)
        .json(
          errorResponse(
            400,
            "chequeSerialNumber and amount are required",
            false
          )
        );
    }

    let type = null;
    if (party || payee) {
      type = "debit";
    } else if (toBankAccount) {
      type = "credit";
    } else {
      return res
        .status(400)
        .json(
          errorResponse(
            400,
            "You must provide a payee, party, or toBankAccount",
            false
          )
        );
    }

    const cheque = await Cheque.findOne({
      _id: chequeSerialNumber,
      actionBy: actionBy,
      userId: user,
    });

    if (!cheque) {
      return res
        .status(404)
        .json(errorResponse(404, "Cheque not found", false));
    }

    const from = decryptData(cheque.from);
    const to = decryptData(cheque.to);
    const realChequeNumber = decryptData(cheque.chequeSerialNumber);

    if (realChequeNumber < from || realChequeNumber > to) {
      return res
        .status(400)
        .json(errorResponse(400, "Cheque number is out of range", false));
    }

    const existingIssued = await IssuedCheque.findOne({
      chequeSerialNumber,
    });
    if (existingIssued) {
      return res
        .status(400)
        .json(errorResponse(400, "This cheque is already issued", false));
    }

    if (party) {
      const partyDoc = await Party.find({ _id: party, actionBy: actionBy });

      if (!partyDoc) {
        return res
          .status(404)
          .json(errorResponse(404, "Party not found", false));
      }
    }

    if (toBankAccount) {
      const bank = await Bank.find({ _id: toBankAccount, actionBy });
      if (!bank) {
        return res
          .status(404)
          .json(errorResponse(404, "Recipient bank account not found", false));
      }
    }

    const newIssuedCheque = new IssuedCheque({
      chequeSerialNumber,
      issueDate,
      issuedBy,
      payee,
      party: party || null,
      toBankAccount: toBankAccount || null,
      amount: encryptData(amount).encryptedData,
      remarks: encryptData(remarks || "").encryptedData,
      status: "issued",
      userId: user,
      type,
      actionBy,
    });

    await newIssuedCheque.save();

    cheque.status = "used";
    await cheque.save();

    return res
      .status(201)
      .json(
        successResponse(201, "Cheque issued successfully", newIssuedCheque)
      );
  } catch (error) {
    console.error("CreateIssueCheque Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, error.message || "Server error", false));
  }
};

// export const UpdateIssuedCheque = async (req, res) => {
//   try {
//     const actionBy = req.actionBy;
//     const user = req.user;
//     const { chequeId } = req.params;
//     const { status ,remarks} = req.decryptedBody;

//     if (!["cleared", "Rejected"].includes(status)) {
//       return res.status(400).json(errorResponse(400, "Invalid status", false));
//     }

//     const issuedCheque = await IssuedCheque.findOne({
//       _id: chequeId,
//     });
//     if (!chequeId) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Cheque ID is required in URL params", false));
//     }
//     if (!issuedCheque) {
//       return res
//         .status(404)
//         .json(errorResponse(404, "Issued cheque not found", false));
//     }

//     if (issuedCheque.status === "cleared") {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Cheque already cleared", false));
//     }

//     issuedCheque.status = status;
//     await issuedCheque.save();

//     if (status === "Rejected") {
//       return res
//         .status(200)
//         .json(
//           successResponse(
//             200,
//             "Cheque status updated to rejected",
//             issuedCheque
//           )
//         );
//     }

//     const cheque = await Cheque.findOne({
//       _id: issuedCheque.chequeSerialNumber,
//     });
//     if (!cheque) {
//       return res
//         .status(404)
//         .json(errorResponse(404, "Cheque not found", false));
//     }

//     const amount = parseFloat(decryptData(issuedCheque.amount));
//     if (isNaN(amount)) {
//       return res.status(400).json(errorResponse(400, "Invalid amount", false));
//     }

//     const chequeBank = await Bank.findOne({
//       _id: cheque.bankId,
//     });
//     if (!chequeBank) {
//       return res
//         .status(404)
//         .json(errorResponse(404, "Cheque bank account not found", false));
//     }

//     const latestTxn = await Transaction.findOne({
//       bankId: chequeBank._id,
//       userId: user,
//       actionBy: actionBy,
//     }).sort({ createdAt: -1 });
//     const prevBalance = latestTxn
//       ? parseFloat(decryptData(latestTxn.closingBalance))
//       : parseFloat(decryptData(chequeBank.balance));

//     const newBalance = prevBalance - amount;
//     if (newBalance < 0) {
//       return res
//         .status(400)
//         .json(
//           errorResponse(400, "Insufficient balance in cheque account", false)
//         );
//     }

//     const transactionsToSave = [];

//     transactionsToSave.push({
//       userId: user,
//       actionBy,
//       type: "debit",
//       amount: encryptData(String(amount)).encryptedData,
//       Balance: encryptData(String(prevBalance)).encryptedData,
//       closingBalance: encryptData(String(newBalance)).encryptedData,
//       bankId: chequeBank._id,
//       status: "success",
//       date: new Date(),
//       narration: `Cheque cleared (IssuedChequeId: ${issuedCheque._id}) - Debit from cheque account`,
//     });

//     if (issuedCheque.toBankAccount) {
//       const recipientBank = await Bank.findOne({
//         _id: issuedCheque.toBankAccount,
//         userId: user,
//         actionBy,
//       });
//       if (!recipientBank) {
//         return res
//           .status(404)
//           .json(errorResponse(404, "Recipient bank account not found", false));
//       }

//       const recipientLatestTxn = await Transaction.findOne({
//         bankId: recipientBank._id,
//         userId: user,
//         actionBy,
//       }).sort({ createdAt: -1 });
// const recipientPrevBalance = recipientLatestTxn
//   ? parseFloat(decryptData(recipientLatestTxn.closingBalance))
//   : parseFloat(decryptData(recipientBank.balance));

//       const recipientNewBalance = recipientPrevBalance + amount;

//       transactionsToSave.push({
//         userId: user,
//         actionBy,
//         type: "credit",
//         amount: encryptData(String(amount)).encryptedData,
//         Balance: encryptData(String(recipientPrevBalance)).encryptedData,
//         closingBalance: encryptData(String(recipientNewBalance)).encryptedData,
//         bankId: recipientBank._id,
//         status: "success",
//         date: new Date(),
//         narration: `Cheque cleared (IssuedChequeId: ${issuedCheque._id}) - Credit to recipient bank`,
//       });

//       recipientBank.balance = encryptData(
//         String(recipientNewBalance)
//       ).encryptedData;
//       await recipientBank.save();
//     }

//     await Transaction.insertMany(transactionsToSave);

//     chequeBank.balance = encryptData(String(newBalance)).encryptedData;
//     await chequeBank.save();

//     return res
//       .status(200)
//       .json(
//         successResponse(
//           200,
//           "Cheque cleared and transaction(s) recorded",
//           issuedCheque
//         )
//       );
//   } catch (error) {
//     console.error("Update Issued Cheque Status Error:", error);
//     return res
//       .status(500)
//       .json(errorResponse(500, error.message || "Server error", false));
//   }
// };

// export const UpdateIssuedCheque = async (req, res) => {
//   try {
//     const actionBy = req.actionBy;
//     const user = req.user;
//     const { chequeId } = req.params;
//     const { status, remarks } = req.decryptedBody;

//     if (!["cleared", "Rejected"].includes(status)) {
//       return res.status(400).json(errorResponse(400, "Invalid status", false));
//     }

//     if (!chequeId) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Cheque ID is required in URL params", false));
//     }

//     const issuedCheque = await IssuedCheque.findOne({ _id: chequeId });
//     console.log(issuedCheque, "gfutjh kuklgv8520741")
//     if (!issuedCheque) {
//       return res
//         .status(404)
//         .json(errorResponse(404, "Issued cheque not found", false));
//     }

//     if (issuedCheque.status === "cleared") {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Cheque already cleared", false));
//     }

//     issuedCheque.status = status;
//     if (remarks) issuedCheque.remarks = remarks;
//     await issuedCheque.save();

//     if (status === "Rejected") {
//       return res
//         .status(200)
//         .json(successResponse(200, "Cheque status updated to rejected", issuedCheque));
//     }

//     const cheque = await Cheque.findOne({ _id: issuedCheque.chequeSerialNumber });
//     if (!cheque) {
//       return res.status(404).json(errorResponse(404, "Cheque not found", false));
//     }

//    const amount = parseFloat(decryptData(issuedCheque.amount));
//    console.log(amount, "hellob sank")
//     if (isNaN(amount)) {
//       return res.status(400).json(errorResponse(400, "Invalid amount", false));
//     }

//     const chequeBank = await Bank.findOne({ _id: cheque.bankId });
//     if (!chequeBank) {
//       return res.status(404).json(errorResponse(404, "Cheque bank account not found", false));
//     }

//     const latestTxn = await Transaction.findOne({
//       bankId: chequeBank._id,
//       userId: user,
//       actionBy: actionBy,
//     }).sort({ createdAt: -1 });

//    const prevBalance = latestTxn
//   ? parseFloat(decryptData(latestTxn.closingBalance)?.replace(/"/g, ""))
//   : parseFloat(decryptData(chequeBank.Balance)?.replace(/"/g, ""))

//     const newBalance = prevBalance - amount;
//     if (newBalance < 0) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Insufficient balance in cheque account", false));
//     }

//     const transactionsToSave = [];

//     transactionsToSave.push({
//       userId: user,
//       actionBy,
//       type: "debit",
//       amount: encryptData(String(amount)).encryptedData,
//       Balance: encryptData(String(prevBalance)).encryptedData,
//       closingBalance: encryptData(String(newBalance)).encryptedData,
//       bankId: chequeBank._id,
//       status: "success",
//       date: new Date(),
//       narration: `Cheque cleared (IssuedChequeId: ${issuedCheque._id}) - Debit from cheque account`,
//     });

//     if (issuedCheque.toBankAccount) {
//       const recipientBank = await Bank.findOne({
//         _id: issuedCheque.toBankAccount,
//         userId: user,
//         actionBy,
//       });
//       console.log(recipientBank,"rrrrtr")
//       if (!recipientBank) {
//         return res
//           .status(404)
//           .json(errorResponse(404, "Recipient bank account not found", false));
//       }

//       const recipientLatestTxn = await Transaction.findOne({
//         bankId: recipientBank._id,
//         userId: user,
//         actionBy,
//       }).sort({ createdAt: -1 });
//       console.log(recipientLatestTxn,"hiiiii1210102142452")

//   const recipientPrevBalance = recipientLatestTxn
//         ? parseFloat(decryptData(recipientLatestTxn.closingBalance))
//         : parseFloat(decryptData(recipientBank.Balance));

//       const recipientNewBalance = recipientPrevBalance + amount;

//       transactionsToSave.push({
//         userId: user,
//         actionBy,
//         type: "credit",
//         amount: encryptData(String(amount)).encryptedData,
//         Balance: encryptData(String(recipientPrevBalance)).encryptedData,
//         closingBalance: encryptData(String(recipientNewBalance)).encryptedData,
//         bankId: recipientBank._id,
//         status: "success",
//         date: new Date(),
//         narration: `Cheque cleared (IssuedChequeId: ${issuedCheque._id}) - Credit to recipient bank`,
//       });

//       recipientBank.Balance = encryptData(String(recipientNewBalance)).encryptedData;
//       await recipientBank.save();
//     }

//     await Transaction.insertMany(transactionsToSave);

//     chequeBank.Balance = encryptData(String(newBalance)).encryptedData;
//     await chequeBank.save();

//     return res
//       .status(200)
//       .json(successResponse(200, "Cheque cleared and transaction(s) recorded", issuedCheque));
//   } catch (error) {
//     console.error("Update Issued Cheque Status Error:", error);
//     return res
//       .status(500)
//       .json(errorResponse(500, error.message || "Server error", false));
//   }
// };

//######################################################################################################################################################

// export const UpdateIssuedCheque = async (req, res) => {
//   try {
//     const actionBy = req.actionBy;
//     const user = req.user;
//     const { chequeId } = req.params;
//     const { status, remarks } = req.decryptedBody;

//     if (!["cleared", "Rejected"].includes(status)) {
//       return res.status(400).json(errorResponse(400, "Invalid status", false));
//     }

//     if (!chequeId) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Cheque ID is required in URL params", false));
//     }

//     const issuedCheque = await IssuedCheque.findOne({ _id: chequeId });
//     if (!issuedCheque) {
//       return res
//         .status(404)
//         .json(errorResponse(404, "Issued cheque not found", false));
//     }

//     if (issuedCheque.status === "cleared") {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Cheque already cleared", false));
//     }

//     issuedCheque.status = status;
//     if (remarks) issuedCheque.remarks = encryptData(remarks || "").encryptedData;
//     await issuedCheque.save();

//     if (status === "Rejected") {
//       return res
//         .status(200)
//         .json(successResponse(200, "Cheque status updated to rejected", issuedCheque));
//     }

//     const cheque = await Cheque.findOne({ _id: issuedCheque.chequeSerialNumber });
//     if (!cheque) {
//       return res.status(404).json(errorResponse(404, "Cheque not found", false));
//     }

//     const amount = parseFloat(decryptData(issuedCheque.amount));
//     if (isNaN(amount)) {
//       return res.status(400).json(errorResponse(400, "Invalid amount", false));
//     }

//     const chequeBank = await Bank.findOne({ _id: cheque.bankId });
//     if (!chequeBank) {
//       return res.status(404).json(errorResponse(404, "Cheque bank account not found", false));
//     }

//     const latestTxn = await Transaction.findOne({
//       bankId: chequeBank._id,
//       userId: user,
//       actionBy,
//     }).sort({ createdAt: -1 });

//     const prevBalance = latestTxn
//       ? parseFloat(decryptData(latestTxn.closingBalance))
//       : parseFloat(decryptData(chequeBank.Balance));

//     const newBalance = prevBalance - amount;
//     if (newBalance < 0) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Insufficient balance in cheque account", false));
//     }

//     const transactionsToSave = [];

//     transactionsToSave.push({
//       userId: user,
//       actionBy,
//       type: "debit",
//       amount: encryptData(String(amount)).encryptedData,
//       Balance: encryptData(String(prevBalance)).encryptedData,
//       closingBalance: encryptData(String(newBalance)).encryptedData,
//       bankId: chequeBank._id,
//       status: "success",
//       date: new Date(),
//       description: `Cheque cleared (IssuedChequeId: ${issuedCheque._id}) - Debit from cheque account`,
//     });

//     if (issuedCheque.toBankAccount) {
//       const recipientBank = await Bank.findOne({
//         _id: issuedCheque.toBankAccount,
//         userId: user,

//       });
// console.log(issuedCheque,"iss")

// console.log("toBankAccount ID:", issuedCheque.toBankAccount);
// console.log("userId:", user);
// console.log("actionBy:", actionBy);

//       if (!recipientBank) {
//         return res
//           .status(404)
//           .json(errorResponse(404, "Recipient bank account not found", false));
//       }

//       const recipientLatestTxn = await Transaction.findOne({
//         bankId: recipientBank._id,
//         userId: user,

//       }).sort({ createdAt: -1 });

//  console.log("Querying recipient transaction with:");
// console.log("bankId:", recipientBank?._id);
// console.log("userId:", user);

//       const recipientPrevBalance = recipientLatestTxn
//         ? parseFloat(decryptData(recipientLatestTxn.closingBalance))
//         : parseFloat(decryptData(recipientBank.Balance));

//       const recipientNewBalance = recipientPrevBalance + amount;

//       transactionsToSave.push({
//         userId: user,
//         actionBy,
//         type: "credit",
//         amount: encryptData(String(amount)).encryptedData,
//         Balance: encryptData(String(recipientPrevBalance)).encryptedData,
//         closingBalance: encryptData(String(recipientNewBalance)).encryptedData,
//         bankId: recipientBank._id,
//         status: "success",
//         date: new Date(),
//         narration: `Cheque cleared (IssuedChequeId: ${issuedCheque._id}) - Credit to recipient bank`,
//       });

//       recipientBank.Balance = encryptData(String(recipientNewBalance)).encryptedData;
//       await recipientBank.save();
//     }

//     await Transaction.insertMany(transactionsToSave);

//     chequeBank.Balance = encryptData(String(newBalance)).encryptedData;
//     await chequeBank.save();

//     return res
//       .status(200)
//       .json(successResponse(200, "Cheque cleared and transaction(s) recorded", issuedCheque));
//   } catch (error) {
//     console.error("Update Issued Cheque Status Error:", error);
//     return res
//       .status(500)
//       .json(errorResponse(500, error.message || "Server error", false));
//   }
// };

const decryptSafe = (data) => {
  if (typeof data !== "string" || !data) return "";
  try {
    return decryptData(data);
  } catch {
    return "";
  }
};
export const UpdateIssuedCheque = async (req, res) => {
  try {
    const actionBy = req.actionBy;
    const user = req.user;
    const { chequeId } = req.params;
    const { status, remarks } = req.decryptedBody;

    if (!["cleared", "Rejected"].includes(status)) {
      return res.status(400).json(errorResponse(400, "Invalid status", false));
    }

    if (!chequeId) {
      return res
        .status(400)
        .json(errorResponse(400, "Cheque ID is required in URL params", false));
    }

    const issuedCheque = await IssuedCheque.findOne({ _id: chequeId });
    if (!issuedCheque) {
      return res
        .status(404)
        .json(errorResponse(404, "Issued cheque not found", false));
    }

    if (issuedCheque.status === "cleared") {
      return res
        .status(400)
        .json(errorResponse(400, "Cheque already cleared", false));
    }

    issuedCheque.status = status;
    if (remarks)
      issuedCheque.remarks = encryptData(remarks || "").encryptedData;
    await issuedCheque.save();

    if (status === "Rejected") {
      return res
        .status(200)
        .json(
          successResponse(
            200,
            "Cheque status updated to rejected",
            issuedCheque
          )
        );
    }

    const cheque = await Cheque.findOne({
      _id: issuedCheque.chequeSerialNumber,
    });
    if (!cheque) {
      return res
        .status(404)
        .json(errorResponse(404, "Cheque not found", false));
    }

    const amount = parseFloat(decryptData(issuedCheque.amount));
    if (isNaN(amount)) {
      return res.status(400).json(errorResponse(400, "Invalid amount", false));
    }

    const chequeBank = await Bank.findOne({ _id: cheque.bankId });
    if (!chequeBank) {
      return res
        .status(404)
        .json(errorResponse(404, "Cheque bank account not found", false));
    }

    const latestTxn = await Transaction.findOne({
      bankId: chequeBank._id,
      userId: user,
      actionBy,
    }).sort({ createdAt: -1 });

    const prevBalance = latestTxn
      ? parseFloat(decryptData(latestTxn.closingBalance))
      : parseFloat(decryptData(chequeBank.Balance));

    const newBalance = prevBalance - amount;
    if (newBalance < 0) {
      return res
        .status(400)
        .json(
          errorResponse(400, "Insufficient balance in cheque account", false)
        );
    }

    const transactionsToSave = [];

    const partyName = issuedCheque.party
      ? decryptSafe(issuedCheque.party)
      : null;
    const payeeName = issuedCheque.payee
      ? decryptData(issuedCheque.payee)
      : null;
    const chequeBankName = chequeBank.bankName
      ? decryptData(chequeBank.bankName)
      : "Cheque Bank";

    const debitDescription = issuedCheque.toBankAccount
      ? `Cheque cleared (IssuedChequeId: ${issuedCheque._id}) - Transferred to another bank`
      : `Cheque cleared (IssuedChequeId: ${issuedCheque._id}) - Paid to ${
          partyName || payeeName || "Unknown"
        }`;

    transactionsToSave.push({
      userId: user,
      actionBy,
      type: "debit",
      amount: encryptData(String(amount)).encryptedData,
      Balance: encryptData(String(prevBalance)).encryptedData,
      closingBalance: encryptData(String(newBalance)).encryptedData,
      bankId: chequeBank._id,
      status: "success",
      date: new Date(),
      description: debitDescription,
    });

    if (issuedCheque.toBankAccount) {
      const recipientBank = await Bank.findOne({
        _id: issuedCheque.toBankAccount,
        userId: user,
      });

      if (!recipientBank) {
        return res
          .status(404)
          .json(errorResponse(404, "Recipient bank account not found", false));
      }

      const recipientLatestTxn = await Transaction.findOne({
        bankId: recipientBank._id,
        userId: user,
      }).sort({ createdAt: -1 });

      const recipientPrevBalance = recipientLatestTxn
        ? parseFloat(decryptData(recipientLatestTxn.closingBalance))
        : parseFloat(decryptData(recipientBank.Balance));

      const recipientNewBalance = recipientPrevBalance + amount;

      const creditDescription = `Cheque cleared (IssuedChequeId: ${issuedCheque._id}) - Received from ${chequeBankName}`;

      transactionsToSave.push({
        userId: user,
        actionBy,
        type: "credit",
        amount: encryptData(String(amount)).encryptedData,
        Balance: encryptData(String(recipientPrevBalance)).encryptedData,
        closingBalance: encryptData(String(recipientNewBalance)).encryptedData,
        bankId: recipientBank._id,
        status: "success",
        date: new Date(),
        description: creditDescription,
      });

      recipientBank.Balance = encryptData(
        String(recipientNewBalance)
      ).encryptedData;
      await recipientBank.save();
    }

    await Transaction.insertMany(transactionsToSave);

    chequeBank.Balance = encryptData(String(newBalance)).encryptedData;
    await chequeBank.save();

    return res
      .status(200)
      .json(
        successResponse(
          200,
          "Cheque cleared and transaction(s) recorded",
          issuedCheque
        )
      );
  } catch (error) {
    console.error("Update Issued Cheque Status Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, error.message || "Server error", false));
  }
};
