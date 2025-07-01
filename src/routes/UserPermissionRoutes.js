import express from 'express';
import { createRolePermission, deleteRolePermission, getAllRolePermissions, updateRolePermission } from '../controller/UserPermissionController.js';
import { AllvalidateSchema } from '../middlewares/userValidation.js';
import { rolePermissionUpdateValidation, rolePermissionValidation } from '../utils/valgst.js';

const userPermission=express.Router();

userPermission.post("/userpermission",AllvalidateSchema(rolePermissionValidation),createRolePermission);
userPermission.get("/userpermission",getAllRolePermissions);
userPermission.delete("/userpermission/:id",deleteRolePermission);
userPermission.put("/userpermission/:id",AllvalidateSchema(rolePermissionUpdateValidation),updateRolePermission);

export default userPermission;