import express from"express"
import {  createOrUpdateRole, deleteRole, getAllRoles } from "../controller/Rolecontroller.js";
import { AllvalidateSchema } from "../middlewares/userValidation.js";
import { roleValidationSchema } from "../utils/valgst.js";
import { authorize } from "../middlewares/auth.js";

const manageroleRoutes=express.Router();

manageroleRoutes.post("/managerole",AllvalidateSchema(roleValidationSchema),authorize,createOrUpdateRole);
// manageroleRoutes.put("/managerole/:id",updateRole)
manageroleRoutes.get("/managerole",authorize,getAllRoles);

manageroleRoutes.delete("/managerole/:id",deleteRole);

export default manageroleRoutes;

