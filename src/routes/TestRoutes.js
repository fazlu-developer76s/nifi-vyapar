import express from "express";
import { testAuth } from "../controller/testController.js";
import { authorize } from "../middlewares/auth.js";
import { adminauthorize } from "../middlewares/admin.js";

const TestRoutes=express.Router();

TestRoutes.get("/test",authorize,testAuth);
TestRoutes.get("/testAdmin",adminauthorize,testAuth)

export default TestRoutes