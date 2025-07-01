import express from 'express';
import {
  createPrimaryUnit,
  getAllPrimaryUnits,
  getPrimaryUnitById,
  updatePrimaryUnit,
  deletePrimaryUnit,
  getOurAllPrimaryUnits
} from '../controller/PrimaryUniController.js';
import { AllvalidateSchema } from '../middlewares/userValidation.js';
import { primaryUnitValidationSchema } from '../utils/valgst.js';
import { primaryUnitUpdateValidationSchema } from '../utils/valgst.js';
import { authorize } from '../middlewares/auth.js';

const PrimaryUnitrouter = express.Router();


PrimaryUnitrouter.post('/Primary/create',AllvalidateSchema(primaryUnitValidationSchema),authorize, createPrimaryUnit);

PrimaryUnitrouter.get('/primary', getAllPrimaryUnits);
PrimaryUnitrouter.get("/primary/all",authorize,getOurAllPrimaryUnits)


PrimaryUnitrouter.post('/primary/get', getPrimaryUnitById);

PrimaryUnitrouter.put('/primary/update/:id', AllvalidateSchema(primaryUnitUpdateValidationSchema),authorize,updatePrimaryUnit);

PrimaryUnitrouter.delete('/primary/delete/:id', deletePrimaryUnit);

export default PrimaryUnitrouter;
