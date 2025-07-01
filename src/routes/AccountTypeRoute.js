import express from "express"
import { createAccountType, deleteAccountType, getAccountTypeById, getAllAccountTypes, updateAccountType } from "../controller/AccounttypeController.js";
import { AllvalidateSchema } from "../middlewares/userValidation.js";
import {accountTypeValidation, accountTypeValidationup,} from "../utils/valgst.js"
import { authorize } from "../middlewares/auth.js";

const accroutes=express.Router();

accroutes.post("/account",AllvalidateSchema(accountTypeValidation),authorize,createAccountType);
accroutes.put("/updateaccount/:id/:actionBy",AllvalidateSchema(accountTypeValidationup),authorize,updateAccountType);
accroutes.get("/getaccount/:actionBy",authorize,getAllAccountTypes);
accroutes.get("/getaccount/:id",authorize,getAccountTypeById);
accroutes.delete("/account/:id",authorize,deleteAccountType);

export default accroutes;
