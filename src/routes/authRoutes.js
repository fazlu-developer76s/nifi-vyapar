 import express from "express";

import {  getAllUsers, googleAuth, logoutUser,  signUpLog } from "../controller/authController.js";
import { AllvalidateSchema } from "../middlewares/userValidation.js";
import { signuplogSchema } from "../utils/valgst.js";


const router = express.Router();

router.post("/signup",AllvalidateSchema(signuplogSchema), signUpLog);
// router.post("/login", loginUser);
router.get("/google", googleAuth); 
router.get("/users",getAllUsers);
router.get("/logout",logoutUser);

export default router;

