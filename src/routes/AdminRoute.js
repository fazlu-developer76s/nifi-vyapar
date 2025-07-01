import  { Router } from "express";
import { adminLogin,resetPassword,forgotPassword } from "../controller/adminController.js";
import { AllvalidateSchema } from "../middlewares/userValidation.js";
import { adminLoginSchema } from "../utils/valgst.js";


const adminRoute = Router();

//admin Routes
adminRoute.post("/admin-login",AllvalidateSchema(adminLoginSchema),adminLogin);
adminRoute.post("/reset-password/:token",resetPassword)
adminRoute.post("/forgot",forgotPassword)
export  {adminRoute};