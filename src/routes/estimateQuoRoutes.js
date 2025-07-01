import express from "express";
import {
    convertEstimateToSaleInvoice,
 convertEstimateToSaleOrder,
 createEstimateQuotation,
 getAllEstimateQuotations,
 updateEstimateQuotation
} from "../controller/EstimateQuotation.js";
// import { AllvalidateSchema } from "../middlewares/userValidation.js";
// import { estimateQuotationSchema } from "../utils/valgst.js";



const EstimateQuotationrouter = express.Router();


EstimateQuotationrouter.post("/estimate/create",createEstimateQuotation);
EstimateQuotationrouter.get("/all",getAllEstimateQuotations)
EstimateQuotationrouter.put("/update/:id",updateEstimateQuotation)
EstimateQuotationrouter.post("/estimateconvert",convertEstimateToSaleInvoice);
EstimateQuotationrouter.post("/estimatetosaleorder/:estimateId",convertEstimateToSaleOrder)


export default EstimateQuotationrouter;
