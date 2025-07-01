import express from "express"
import { createGodown, deleteGodown, getAllGodowns, getGodownById, getOurAllGodowns, updateGodown } from "../controller/GodownController.js";
import { AllvalidateSchema } from "../middlewares/userValidation.js";
import { godownUpdateValidationSchema, godownValidationSchema } from "../utils/valgst.js";
import { authorize } from "../middlewares/auth.js";

const GodownRoutes=express.Router();

GodownRoutes.post("/godown",authorize,AllvalidateSchema(godownValidationSchema),createGodown);
GodownRoutes.put("/godown/:id",authorize,AllvalidateSchema(godownUpdateValidationSchema),updateGodown);
GodownRoutes.delete("/godown/:id",deleteGodown);
GodownRoutes.get("/godown/:id",getGodownById);
GodownRoutes.get("/godown",authorize,getOurAllGodowns)
GodownRoutes.get("/godown/get",getAllGodowns);

export default GodownRoutes;