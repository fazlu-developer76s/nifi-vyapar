import express from "express";
import {
  CreateissueCheque,
  deleteIssuedCheque,
  getIssuedCheques,
  getttIssuedCheques,
  UpdateIssuedCheque,
} from "../controller/ChequeIssue.js";
import { AllvalidateSchema } from "../middlewares/userValidation.js";
import {
  issueChequeValidation,
  issueUpadteChequeValidation,
} from "../utils/valgst.js";
import { authorize } from "../middlewares/auth.js";
import { auth } from "google-auth-library";
// adjust based on your setup

const ChequeIssuedrouter = express.Router();

ChequeIssuedrouter.post(
  "/create/issuedCheque",
  AllvalidateSchema(issueChequeValidation),
  authorize,
  CreateissueCheque
);
ChequeIssuedrouter.put(
  "/issuecheque/:chequeId",
  authorize,
  AllvalidateSchema(issueUpadteChequeValidation),
  UpdateIssuedCheque
);
ChequeIssuedrouter.get("/issuecheque", authorize, getIssuedCheques);
ChequeIssuedrouter.get("/Allissuecheque",authorize, getttIssuedCheques);

ChequeIssuedrouter.delete("/issuecheque/:issuedChequeId",  deleteIssuedCheque);

export default ChequeIssuedrouter;
