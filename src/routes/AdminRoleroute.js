import express from 'express';
import { createRole, deleteRole, getRoleById, getRoles, updateRole } from '../controller/AdminRole.js';
import { adminauthorize } from '../middlewares/admin.js';
import { AllvalidateSchema } from '../middlewares/userValidation.js';
import { validateAdminRole } from '../utils/valgst.js';
import { validateUpdateAdminRole } from '../utils/valgst.js';


const adminRoleRoute = express.Router();

adminRoleRoute.post("/role",adminauthorize,AllvalidateSchema(validateAdminRole),createRole)
adminRoleRoute.get("/role",adminauthorize,getRoles);
adminRoleRoute.get("/role/:id",adminauthorize,getRoleById);
adminRoleRoute.put("/role/:id",adminauthorize,AllvalidateSchema(validateUpdateAdminRole),updateRole);
adminRoleRoute.delete("/role/:id",adminauthorize,deleteRole);

export default adminRoleRoute;