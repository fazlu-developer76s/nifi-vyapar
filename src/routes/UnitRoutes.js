import express from "express";
import {
  createUnit,
  updateUnit,
  getAllUnits,
  
  deleteUnit
} from "../controller/UnitController.js";
import { AllvalidateSchema } from "../middlewares/userValidation.js";
import { unitSchema } from "../utils/valgst.js";

const Unitrouter = express.Router();

// Create Unit
Unitrouter.post("/Unit/create",AllvalidateSchema(unitSchema), createUnit);

// Update Unit (id from params)
Unitrouter.put("/updateUnit/:id",AllvalidateSchema(unitSchema), updateUnit);

Unitrouter.get("/Unit/all", getAllUnits);


Unitrouter.delete("/Unitdelete/:id", deleteUnit);

export default Unitrouter;  
