import express from 'express';
import { createBank, updateBank, getAllBanks, deleteBank, getOurAllBanks } from '../controller/bankcontroller.js'; // Adjust the import path
import { AllvalidateSchema } from '../middlewares/userValidation.js';

import { authorize } from '../middlewares/auth.js';
import {bankUpadteValidationSchema, bankValidationSchema} from "../utils/valgst.js"

const Bankrouter = express.Router();


Bankrouter.post('/bank/create', AllvalidateSchema(bankValidationSchema), authorize,createBank);
Bankrouter.get('/bank/all', getAllBanks);
Bankrouter.put('/bankupdate/:bankId/:actionBy', AllvalidateSchema(bankUpadteValidationSchema),authorize, updateBank);
Bankrouter.delete('/bank/:id', deleteBank);
Bankrouter.get("/bank/get-our/:actionBy",authorize,getOurAllBanks);

export default Bankrouter;
