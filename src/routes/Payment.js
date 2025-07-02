import express from 'express';
import { createPaymentType, getPaymentTypes, updatePaymnentType } from '../controller/PaymentController.js';

const paymnentRoutes=express.Router();

paymnentRoutes.post("/payment",createPaymentType);
paymnentRoutes.put("/payment/:id",updatePaymnentType);
paymnentRoutes.get("/Allpayment",getPaymentTypes);

export default paymnentRoutes;