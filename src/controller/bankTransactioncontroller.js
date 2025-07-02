import { decryptData, encryptData } from "../lib/encrypt.js";
import { errorResponse, successResponse } from "../lib/reply.js";
import Bank from "../models/Bank.js";
import fs from "fs";
import path from "path";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import Transaction from "../models/transactionBank.js";
import User from "../models/User.js";
import { Company } from "../models/Company.js";
import { generateTransactionExcel } from "../utils/generateTransactionExcel.js";
import { generateTransactionPdf } from "../utils/generateTransactionPdf.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { AdmCompany } from "../models/userAdminCompany.js";

export const getTransactionById = async (req, res) => {
  try {
    const user = req.user;

    const { id } = req.params;

    const transaction = await Transaction.findOne({ _id: id, userId: user })

      .populate({
        path: "from",
        model: "Bank",
        select:
          "accountDisplayName accountnumber ifscCode bankName branch Balance",
      })
      .populate({
        path: "to",
        model: "Bank",
        select:
          "accountDisplayName accountnumber ifscCode bankName branch Balance",
      });

    if (!transaction) {
      return res
        .status(404)
        .json(errorResponse(404, "Transaction not found", false));
    }

    const decryptField = (field) =>
      field ? decryptData(field)?.replace(/"/g, "") : null;

    const decryptedFrom = transaction.from
      ? {
          ...transaction.from._doc,
          accountDisplayName: decryptField(transaction.from.accountDisplayName),
          accountnumber: decryptField(transaction.from.accountnumber),
          ifscCode: decryptField(transaction.from.ifscCode),
          bankName: decryptField(transaction.from.bankName),
          branch: decryptField(transaction.from.branch),
          Balance: decryptField(transaction.from.Balance),
        }
      : null;

    const decryptedTo = transaction.to
      ? {
          ...transaction.to._doc,
          accountDisplayName: decryptField(transaction.to.accountDisplayName),
          accountnumber: decryptField(transaction.to.accountnumber),
          ifscCode: decryptField(transaction.to.ifscCode),
          bankName: decryptField(transaction.to.bankName),
          branch: decryptField(transaction.to.branch),
          Balance: decryptField(transaction.to.Balance),
        }
      : null;

    const decryptedTransaction = {
      ...transaction._doc,
      amount: decryptField(transaction.amount),
      closingBalance: decryptField(transaction.closingBalance),
      Balance: decryptField(transaction.Balance),
      from: decryptedFrom,
      to: decryptedTo,
    };

    return res
      .status(200)
      .json(
        successResponse(
          200,
          "Transaction retrieved successfully",
          decryptedTransaction,
          true
        )
      );
  } catch (error) {
    console.error("Get Transaction By ID Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false));
  }
};

// export const createTransaction = async (req, res) => {
//   try {
//     const userId = req.user;
//     const { from, to, amount, refNo, description } = req.decryptedBody;

//     const fromBank = from
//       ? await Bank.findOne({ _id: from, userId }).populate("AccountTypeId")
//       : null;

//     const toBank = to
//       ? await Bank.findOne({ _id: to, userId }).populate("AccountTypeId")
//       : null;

//     console.log("fromBank:", fromBank);
//     console.log("toBank:", toBank);

//     if ((from && !fromBank) || (to && !toBank)) {
//       return res
//         .status(404)
//         .json(errorResponse(404, "Bank account(s) not found", false));
//     }

//     const fromBalance = fromBank
//       ? parseFloat(decryptData(fromBank.Balance)?.replace(/"/g, ""))
//       : 0;

//     const toBalance = toBank
//       ? parseFloat(decryptData(toBank.Balance)?.replace(/"/g, ""))
//       : 0;

//     const amountNum = parseFloat(amount);

//     if (isNaN(amountNum) || amountNum <= 0) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Amount must be a positive number", false));
//     }

//     if (fromBank && isNaN(fromBalance)) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Invalid balance in 'from' account", false));
//     }

//     if (toBank && isNaN(toBalance)) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Invalid balance in 'to' account", false));
//     }

//     const fromType = fromBank?.AccountTypeId?.type || null;
//     const toType = toBank?.AccountTypeId?.type || null;

//     let transactionType = null;

//     if (fromType && toType) {
//       if (fromBalance < amountNum) {
//         return res
//           .status(400)
//           .json(
//             errorResponse(400, "Insufficient funds in 'from' account", false)
//           );
//       }
//       if (fromType === "bank" && toType === "bank")
//         transactionType = "bank-to-bank";
//       else if (fromType === "bank" && toType === "cash")
//         transactionType = "bank-to-cash";
//       else if (fromType === "cash" && toType === "bank")
//         transactionType = "cash-to-bank";
//       else if (fromType === "cash" && toType === "cash")
//         transactionType = "cash-to-cash";
//       else transactionType = "transfer";
//     } else if (fromType && !toType) {
//       if (fromBalance < amountNum) {
//         return res
//           .status(400)
//           .json(
//             errorResponse(400, "Insufficient funds in 'from' account", false)
//           );
//       }
//       transactionType = "debit";
//     } else if (!fromType && toType) {
//       transactionType = "credit";
//     } else {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Invalid transaction accounts", false));
//     }

//     const newFromBalance = fromBank ? fromBalance - amountNum : null;
//     const newToBalance = toBank ? toBalance + amountNum : null;

//     const encryptedAmount = encryptData(amountNum.toFixed(2))?.encryptedData;
//     const encryptedNewFromBalance =
//       newFromBalance !== null
//         ? encryptData(newFromBalance.toFixed(2))?.encryptedData
//         : null;
//     const encryptedNewToBalance =
//       newToBalance !== null
//         ? encryptData(newToBalance.toFixed(2))?.encryptedData
//         : null;

//     const transaction = new Transaction({
//       type: transactionType,
//       from: fromBank?._id || null,
//       to: toBank?._id || null,
//       userId,
//       amount: encryptedAmount,
//       refNo,
//       closingBalance: encryptedNewFromBalance,
//       Balance: encryptedNewToBalance,
//       description,
//     });

//     await transaction.save();

//     if (fromBank) {
//       fromBank.Balance = encryptedNewFromBalance;
//       await fromBank.save();
//     }

//     if (toBank) {
//       toBank.Balance = encryptedNewToBalance;
//       await toBank.save();
//     }

//     return res
//       .status(201)
//       .json(
//         successResponse(
//           201,
//           "Transaction created successfully",
//           null,
//           true,
//           transaction
//         )
//       );
//   } catch (error) {
//     console.error("Transaction error:", error);
//     return res
//       .status(500)
//       .json(errorResponse(500, "something went wrong", false));
//   }
// };

export const getAllexportTransactions = async (req, res) => {
  try {
 const { actionBy } = req.params;
    console.log(actionBy)
    const user = req.user;
    const { date, fromDate, toDate, type, bankId, format } = req.query;

    const filter = { userId: user };
    if (type) filter.type = type;
    if (bankId) filter.bankId = bankId;
if (actionBy) filter.actionBy = actionBy;

    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) {
        filter.createdAt.$gte = new Date(fromDate);
      }
      if (toDate) {
        const toDateObj = new Date(toDate);
        toDateObj.setHours(23, 59, 59, 999); // End of the toDate
        filter.createdAt.$lte = toDateObj;
      }
    }
    const transactions = await Transaction.find(filter)
      .populate({
        path: "bankId",
        select: "accountDisplayName accountnumber ifscCode bankName branch",
      })
      .sort({ createdAt: -1 });

    if (!transactions.length) {
      return res.status(404).send("No transactions found for export");
    }

    const decryptField = (field) =>
      field ? decryptData(field)?.replace(/"/g, "") : null;

    const formattedData = transactions.map((txn) => {
      const decryptedBank = txn.bankId
        ? {
            accountDisplayName: decryptField(txn.bankId.accountDisplayName),
            accountnumber: decryptField(txn.bankId.accountnumber),
            ifscCode: decryptField(txn.bankId.ifscCode),
            bankName: decryptField(txn.bankId.bankName),
            branch: decryptField(txn.bankId.branch),
          }
        : {};

      return {
        date: txn.createdAt.toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
        type: txn.type,
        amount: decryptField(txn.amount),
        balance: decryptField(txn.Balance),
        closingBalance: decryptField(txn.closingBalance),
        bank: decryptedBank.bankName || "",
        account: decryptedBank.accountnumber || "",
      };
    });

    const outputDir = "./uploads";
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
    const now = new Date().toISOString().split("T")[0];
    const fileName = `transactions_${now}.${format === "pdf" ? "pdf" : "xlsx"}`;
    const filePath = path.join(outputDir, fileName);

    if (format === "excel") {
      await generateTransactionExcel(formattedData, filePath);
    } else if (format === "pdf") {
      await generateTransactionPdf(formattedData, filePath);
    } else {
      return res.status(400).send('Invalid format. Use "excel" or "pdf"');
    }

    const cloudinaryUrl = await uploadToCloudinary(filePath);

    fs.unlinkSync(filePath);

    return res.status(200).json({
      success: true,
      message: "File exported and uploaded to Cloudinary",
      downloadUrl: cloudinaryUrl,
    });

    //     res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    //     res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    //   res.download(filePath, fileName, err => {
    //   if (err) {
    //     console.error('Download Error:', err);
    //     return res.status(500).send('Failed to download file');
    //   }

    // });
  } catch (err) {
    console.error("Export Error:", err);
    return res
      .status(500)
      .json(errorResponse(500, "Failed to export transactions", false));
  }
};

export const createTransaction = async (req, res) => {
  try {
    const user = req.user;

    const { from, to, amount, refNo, remark } = req.decryptedBody;
  // ✅ Check if both bank IDs are the same
    if (from && to && from === to) {
      return res.status(400).json(
        errorResponse(400, "From and To bank accounts must be different", false)
      );
    }
    
    const fromBank = from
      ? await Bank.findOne({
          _id: from,
        }).populate("AccountTypeId")
      : null;

    const toBank = to
      ? await Bank.findOne({
          _id: to,
        }).populate("AccountTypeId")
      : null;

    if ((from && !fromBank) || (to && !toBank)) {
      return res
        .status(404)
        .json(errorResponse(404, "Bank account(s) not found", false));
    }

    const fromBalance = fromBank
      ? parseFloat(decryptData(fromBank.Balance)?.replace(/"/g, ""))
      : 0;

    const toBalance = toBank
      ? parseFloat(decryptData(toBank.Balance)?.replace(/"/g, ""))
      : 0;

    const amountNum = parseFloat(amount);

    if (isNaN(amountNum) || amountNum <= 0) {
      return res
        .status(400)
        .json(errorResponse(400, "Amount must be a positive number", false));
    }

    if (fromBank && fromBalance < amountNum) {
      return res
        .status(400)
        .json(errorResponse(400, "Insufficient balance", false));
    }

    const fromType = fromBank?.AccountTypeId?.type?.toUpperCase();
    const toType = toBank?.AccountTypeId?.type?.toUpperCase();

    const decryptedFromAccNo = fromBank
      ? decryptData(fromBank.accountnumber)?.replace(/"/g, "") || "UNKNOWN"
      : "UNKNOWN";
    const decryptedToAccNo = toBank
      ? decryptData(toBank.accountnumber)?.replace(/"/g, "") || "UNKNOWN"
      : "UNKNOWN";

    const newFromBalance = fromBank ? fromBalance - amountNum : null;
    const newToBalance = toBank ? toBalance + amountNum : null;

    const encryptedAmount = encryptData(amountNum.toFixed(2))?.encryptedData;
    const encryptedFromClosingBalance =
      newFromBalance !== null
        ? encryptData(newFromBalance.toFixed(2))?.encryptedData
        : null;
    const encryptedToClosingBalance =
      newToBalance !== null
        ? encryptData(newToBalance.toFixed(2))?.encryptedData
        : null;

    const transactions = [];

    if (fromBank) {
      const description = toBank
        ? `TRF TO ${toType} AC : ${decryptedToAccNo} `
        : `DEBIT FROM ${fromType} AC : ${decryptedFromAccNo}`;

      const debitTransaction = new Transaction({
        type: "debit",
        bankId: fromBank._id,
        userId: user,
        actionBy: fromBank.actionBy,
        refNo,
        amount: encryptedAmount,
        Balance: encryptData(fromBalance.toFixed(2))?.encryptedData,
        closingBalance: encryptedFromClosingBalance,
        description,
        remark,
        status: "success",
      });

      await debitTransaction.save();
      fromBank.Balance = encryptedFromClosingBalance;
      await fromBank.save();
      transactions.push(debitTransaction);
    }

    if (toBank) {
      const description = fromBank
        ? `RCV FROM AC : ${decryptedFromAccNo}`
        : `CREDIT TO ${toType} AC : ${decryptedToAccNo}`;

      const creditTransaction = new Transaction({
        type: "credit",
        bankId: toBank._id,
        userId: user,
        actionBy: toBank.actionBy,
        refNo,
        amount: encryptedAmount,
        Balance: encryptData(toBalance.toFixed(2))?.encryptedData,
        closingBalance: encryptedToClosingBalance,
        description,
        remark,
        status: "success",
      });

      await creditTransaction.save();
      toBank.Balance = encryptedToClosingBalance;
      await toBank.save();
      transactions.push(creditTransaction);
    }

    return res
      .status(201)
      .json(
        successResponse(201, "Transaction successful", null, true, transactions)
      );
  } catch (error) {
    console.error("Transaction Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, "something went wrong", false));
  }
};

export const getAllTransactions = async (req, res) => {
  try {
      const { actionBy } = req.params;
    const user = req.user;
    const { date, type, bankId } = req.query;

    const filter = { userId: user };

    if (type) filter.type = type;

    if (bankId) filter.bankId = bankId;
    
    if (actionBy) filter.actionBy = actionBy;


    if (date) {
      const parsedDate = new Date(date);
      const nextDay = new Date(parsedDate);
      nextDay.setDate(parsedDate.getDate() + 1);

      filter.createdAt = { $gte: parsedDate, $lt: nextDay };
    }

    const transactions = await Transaction.find(filter)
      .populate({
        path: "bankId",
        select: "accountDisplayName accountnumber ifscCode bankName branch",
      })
      .sort({ createdAt: -1 });

    const decryptField = (field) =>
      field ? decryptData(field)?.replace(/"/g, "") : null;

    const decryptedTransactions = transactions.map((txn) => {
      const decryptedBank = txn.bankId
        ? {
            ...txn.bankId._doc,
            accountDisplayName: decryptField(txn.bankId.accountDisplayName),
            accountnumber: decryptField(txn.bankId.accountnumber),
            ifscCode: decryptField(txn.bankId.ifscCode),
            bankName: decryptField(txn.bankId.bankName),
            branch: decryptField(txn.bankId.branch),
          }
        : null;

      return {
        ...txn._doc,
        amount: decryptField(txn.amount),
        closingBalance: decryptField(txn.closingBalance),
        Balance: decryptField(txn.Balance),
        bankId: decryptedBank,
      };
    });

    return res
      .status(200)
      .json(
        successResponse(
          200,
          "Get all transactions successfully",
          null,
          true,
          decryptedTransactions
        )
      );
  } catch (error) {
    console.error("Get Transactions Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false));
  }
};
