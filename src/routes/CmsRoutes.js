import express from "express";
import { authorize } from "../middlewares/auth.js";
import { deleteCMSSection, getAllCMS, getCMSById, updateCMSSection } from "../controller/cmsController.js";
import { validateSchema } from "../middlewares/userValidation.js";
import { cmsValidationSchema } from "../utils/valgst.js";



const cmsRoutes=express.Router();

cmsRoutes.post("/cms/:page",authorize,validateSchema(cmsValidationSchema),updateCMSSection);
cmsRoutes.get("/cms",authorize,getAllCMS);
cmsRoutes.get("/cms/:id",authorize,getCMSById);
cmsRoutes.delete("/cms/:id/section",authorize,deleteCMSSection);

export default cmsRoutes;