import express from "express";
import { assignServiceCodeItem } from "../controller/ServiceItemcode.js";
import { AllvalidateSchema } from "../middlewares/userValidation.js";
import { ServiceCodeItemValidationSchema } from "../utils/valgst.js";

const ServiceCodeItemrouter=express.Router()

ServiceCodeItemrouter.post("/salecode/assign",AllvalidateSchema(ServiceCodeItemValidationSchema), assignServiceCodeItem);


export default ServiceCodeItemrouter;
