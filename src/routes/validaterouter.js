import express from "express"
import {  pancard, upiId, validateAccountNumber, validateGST, validateIFSC } from "../controller/validateController.js";
import { validateSchema } from "../middlewares/userValidation.js";
import { accountnumberValidationSchema, gstValidationSchema, panvalidation, UPIvalidation } from "../utils/valgst.js";



const validaterouter=express.Router();

validaterouter.post('/validate-gstin',validateSchema(gstValidationSchema),validateGST);
validaterouter.get('/validate-ifsc/:ifsc',validateIFSC);
validaterouter.post("/validate-accountnumber",validateSchema(accountnumberValidationSchema),validateAccountNumber);
validaterouter.post("/validate-pan",validateSchema(panvalidation),pancard);
validaterouter.post("/validate-upi",validateSchema(UPIvalidation),upiId);

export default validaterouter