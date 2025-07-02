import express from "express";
import { createSupplier, getAllSupplier, updateSupplier } from "../controller/Supplier.js";
import { AllvalidateSchema } from "../middlewares/userValidation.js";
import { valiadteSupplier } from "../utils/valgst.js";
import { authorize } from "../middlewares/auth.js";
 
const Supllierroutes=express.Router();

Supllierroutes.post("/supplier",authorize,AllvalidateSchema(valiadteSupplier),createSupplier);
Supllierroutes.get("/AllSupplier",authorize,getAllSupplier);
Supllierroutes.put("/supplier/:id",authorize,AllvalidateSchema(valiadteSupplier),updateSupplier);

export default Supllierroutes;
