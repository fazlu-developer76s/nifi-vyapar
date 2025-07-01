import express from "express"

import { createCompany, deleteCompany, getAllCompanies, getCompanyById, updateCompany } from "../controller/CompanyController.js";
import { adminauthorize } from "../middlewares/admin.js";
import { AllvalidateSchema } from "../middlewares/userValidation.js";
import { validateCompany } from "../utils/valgst.js";
import { validateUpdateCompany } from "../utils/valgst.js";


const companyRoutes=express.Router();

companyRoutes.post("/company",adminauthorize,AllvalidateSchema(validateCompany),createCompany);
companyRoutes.get("/company/:id",adminauthorize,getCompanyById);
companyRoutes.get("/company",adminauthorize,getAllCompanies);
companyRoutes.put("/company/:id",adminauthorize,AllvalidateSchema(validateUpdateCompany),updateCompany);
companyRoutes.delete("/company/:id",adminauthorize,deleteCompany)


export default companyRoutes;