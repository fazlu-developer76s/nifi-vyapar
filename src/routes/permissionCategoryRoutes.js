import express from 'express';
import {
  createPermissionCategory,
  updatePermissionCategory,
  getAllPermissionCategories,
  deletePermissionCategory,
  getOurAllPermissionCategories
} from '../controller/permissionCatController.js';
import { AllvalidateSchema, validateSchema } from '../middlewares/userValidation.js';
import { permissionCategoryValidation } from '../utils/valgst.js';
import { authorize } from '../middlewares/auth.js';


const catpermissionrouter = express.Router();

// Create
catpermissionrouter.post('/catpermission/create',AllvalidateSchema(permissionCategoryValidation), authorize,createPermissionCategory);

// Update by ID
catpermissionrouter.put('/catpermission/:id',AllvalidateSchema(permissionCategoryValidation),authorize, updatePermissionCategory);

// Get all
catpermissionrouter.get('/catpermission/get-our', getAllPermissionCategories);

// Delete by ID
catpermissionrouter.delete('/catpermission/delete/:id', deletePermissionCategory);
catpermissionrouter.get("/catpermission/all",authorize,getOurAllPermissionCategories);

export default catpermissionrouter;
