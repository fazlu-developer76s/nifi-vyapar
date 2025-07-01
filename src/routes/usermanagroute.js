import express from "express"
import {  createUserMember, deleteUserMember, getAllUserMembers, getuserMemberById, updateUserMember } from "../controller/UserManageController.js";
import { authorize } from "../middlewares/auth.js";
import { AllvalidateSchema } from "../middlewares/userValidation.js";
import { userMemberCreateSchema, userMemberUpdateSchema } from "../utils/valgst.js";




const usermanagroutes=express.Router();

usermanagroutes.post("/manageuser",authorize,AllvalidateSchema(userMemberCreateSchema),createUserMember);
usermanagroutes.put("/manageuser/:id",authorize,AllvalidateSchema(userMemberUpdateSchema),updateUserMember);
usermanagroutes.delete("/manageuser/:id",deleteUserMember);
usermanagroutes.get("/manageuser",authorize,getAllUserMembers);
usermanagroutes.get("/manageuser/:id",getuserMemberById);

export default usermanagroutes