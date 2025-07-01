import express from "express"
import {  createTransaction,     getAllexportTransactions,     getAllTransactions,       getTransactionById} from "../controller/bankTransactioncontroller.js";
import { authorize } from "../middlewares/auth.js";
import {  transactionValidation } from "../utils/valgst.js";
import { AllvalidateSchema } from "../middlewares/userValidation.js";
import multer from "multer";
import { uploadTransactionFile } from "../controller/uploadtransaction.js";

const bankTrans=express.Router();
const upload = multer({ dest: 'uploads/' });

bankTrans.post("/B2B",authorize,AllvalidateSchema(transactionValidation),createTransaction);
bankTrans.get("/gettrans",authorize,getAllTransactions)

bankTrans.get("/trans/:id",authorize,getTransactionById);

bankTrans.get("/account",authorize,getAllexportTransactions)

bankTrans.post('/upload-transaction-file', upload.single('file'), uploadTransactionFile);


export default bankTrans;