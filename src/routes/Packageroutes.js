import express from "express"
import { createPackage, deletePackage, getAllPackages, getPackageById, updatePackage } from "../controller/PackageController.js";
import { adminauthorize } from "../middlewares/admin.js";
import { AllvalidateSchema } from "../middlewares/userValidation.js";
import { validatePackage } from "../utils/valgst.js";
import { validateUpdatePackage } from "../utils/valgst.js";

const PackageRoutes=express.Router();

PackageRoutes.post("/package",adminauthorize,AllvalidateSchema(validatePackage),createPackage);
PackageRoutes.get("/package",adminauthorize,getAllPackages);
PackageRoutes.get("/package/:id",adminauthorize,getPackageById);
PackageRoutes.put("/package/:id",adminauthorize,AllvalidateSchema(validateUpdatePackage),updatePackage);
PackageRoutes.delete("/package/:id",adminauthorize,deletePackage);

export default PackageRoutes;