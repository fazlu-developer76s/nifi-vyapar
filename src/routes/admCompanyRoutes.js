import express from "express"

import { AllvalidateSchema } from "../middlewares/userValidation.js";
import { validateAdmCompany,  validateUpdateAdmCompany } from "../utils/valgst.js";
import { assignMemberToCompany, createAdmCompany, deleteAdmCompany, getAllAdmCompanies, updateAdmCompany } from "../controller/admCompanyController.js";
import { authorize } from "../middlewares/auth.js";


const AdmcompanyRoutes=express.Router();

AdmcompanyRoutes.post("/Admcompany",authorize,AllvalidateSchema(validateAdmCompany),createAdmCompany);
AdmcompanyRoutes.get("/Admcompany",authorize,getAllAdmCompanies) ;
AdmcompanyRoutes.put("/Admcompany/:id",authorize,AllvalidateSchema(validateUpdateAdmCompany),updateAdmCompany);
AdmcompanyRoutes.delete("/Admcompany/:id",authorize,deleteAdmCompany)
AdmcompanyRoutes.post("/Admcompany/assign",authorize,assignMemberToCompany)

export default AdmcompanyRoutes;