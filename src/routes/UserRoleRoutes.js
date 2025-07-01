import express from "express"
import { createUserRole, deleteUserRole, getUserRoleById, getUserRoles, updateUserRole } from "../controller/UserRoleController.js";
import { authorize } from "../middlewares/auth.js";
import { AllvalidateSchema } from "../middlewares/userValidation.js";
import { createUpdateUserRoleSchema, createUserRoleSchema } from "../utils/valgst.js";

const userRoleRoutes=express.Router();
userRoleRoutes.post("/userRole",authorize,AllvalidateSchema(createUserRoleSchema),createUserRole)
userRoleRoutes.put("/userRole/:id",authorize,AllvalidateSchema(createUpdateUserRoleSchema),updateUserRole);
userRoleRoutes.get("/userRole",authorize,getUserRoles);
userRoleRoutes.get("/userRole/:id",authorize,getUserRoleById);
userRoleRoutes.delete("/userRole/:id",authorize,deleteUserRole);

export default userRoleRoutes;
