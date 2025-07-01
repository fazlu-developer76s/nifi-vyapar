import express from 'express';
import {
  createSecondaryUnit,
  getAllSecondaryUnits,
  getSecondaryUnitById,
  updateSecondaryUnit,
  deleteSecondaryUnit,
  getOurAllSecondaryUnits
} from '../controller/SecondaryUniController.js'
import { AllvalidateSchema } from '../middlewares/userValidation.js';
import { secondaryUnitValidationSchema } from '../utils/valgst.js';
import { secondaryUnitUpdateValidationSchema } from '../utils/valgst.js';
import { authorize } from '../middlewares/auth.js';

const SecondaryUnitrouter = express.Router();


SecondaryUnitrouter.post('/Secondory/create',AllvalidateSchema(secondaryUnitValidationSchema),authorize, createSecondaryUnit);

SecondaryUnitrouter.get('/Secondory/all', getAllSecondaryUnits);


SecondaryUnitrouter.post('/Secondory', getSecondaryUnitById);

SecondaryUnitrouter.put('/Secondory/update/:id',AllvalidateSchema(secondaryUnitUpdateValidationSchema), authorize, updateSecondaryUnit);
SecondaryUnitrouter.get("/Secondory/get",authorize,getOurAllSecondaryUnits)


SecondaryUnitrouter.delete('/Secondory/delete/:id', deleteSecondaryUnit);

export default SecondaryUnitrouter;
