import express from "express"
import { createParty, deleteParty, getAllParties, getOurAllParties, getPartyById, updateParty } from "../controller/partyController.js";
import { authorize } from "../middlewares/auth.js";
import { AllvalidateSchema } from "../middlewares/userValidation.js";
import { validateParty } from "../utils/valgst.js";
import { validateUpdateParty } from "../utils/valgst.js";

const partyRoutes=express.Router();

partyRoutes.post("/party",authorize,AllvalidateSchema(validateParty),createParty);
partyRoutes.get("/party/all",authorize,getAllParties);
partyRoutes.get("/party/:id",authorize,getPartyById);
partyRoutes.get("/party/get/:actionBy",authorize,getOurAllParties)
partyRoutes.delete("/party/:id",deleteParty);
partyRoutes.put("/party/:id/:actionBy",authorize,AllvalidateSchema(validateUpdateParty),updateParty);

export default partyRoutes;