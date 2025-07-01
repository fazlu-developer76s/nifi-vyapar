import express from 'express';
import { createMember, deleteMember, getMemberById, getMembers,  updateMember } from '../controller/memberController.js';

import { adminauthorize } from '../middlewares/admin.js';
import { AllvalidateSchema } from '../middlewares/userValidation.js';
import { validateMember } from '../utils/valgst.js';
import { validateUpdateMember } from '../utils/valgst.js';

const memberRoutes = express.Router();

memberRoutes.post("/member",adminauthorize,AllvalidateSchema(validateMember),createMember);
memberRoutes.get("/member",adminauthorize,getMembers);
memberRoutes.put("/member/:id",adminauthorize,AllvalidateSchema(validateUpdateMember),updateMember);
memberRoutes.delete("/member/:id",adminauthorize,deleteMember);
memberRoutes.get("/member/:id",adminauthorize,getMemberById);

export default memberRoutes;