import express from "express";
import {
  createPermissionSubCategory,
  getAllPermissionSubCategories,
  updatePermissionSubCategory,
  deletePermissionSubCategory,
  getOurAllPermissionSubCategories,
} from "../controller/permissionsubCatController.js";
import { AllvalidateSchema } from "../middlewares/userValidation.js";
import { permissionSubCategoryUpdateValidation, permissionSubCategoryValidation } from "../utils/valgst.js";
import { authorize } from "../middlewares/auth.js";
 
const PermissionSubcatrouter = express.Router();

// Create
PermissionSubcatrouter.post("/sub",AllvalidateSchema(permissionSubCategoryValidation) ,authorize, createPermissionSubCategory);

// Get all
PermissionSubcatrouter.get("/get/subcat", getAllPermissionSubCategories);

// Update
PermissionSubcatrouter.put("/sub/:id",AllvalidateSchema(permissionSubCategoryUpdateValidation),authorize, updatePermissionSubCategory);

// Delete
PermissionSubcatrouter.delete("/delete/sub/:id", deletePermissionSubCategory);

PermissionSubcatrouter.get("/get/sub",authorize,getOurAllPermissionSubCategories)

export default PermissionSubcatrouter;