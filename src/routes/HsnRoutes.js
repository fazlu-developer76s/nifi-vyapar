import express from 'express';
import {
  createHSN,
  updateHSN,
  getAllHSN,
  deleteHSN
} from '../controller/HSNController.js';
import { AllvalidateSchema } from '../middlewares/userValidation.js';
import { createHSNSchema, updateHSNSchema } from '../utils/valgst.js';
import { authorize } from '../middlewares/auth.js';



const Hsnrouter = express.Router();



Hsnrouter.post('/Hsn',authorize, AllvalidateSchema(createHSNSchema), createHSN);
Hsnrouter.put('/Hsn/:id',authorize, AllvalidateSchema(updateHSNSchema), updateHSN);
Hsnrouter.get('/AllHsn',authorize,  getAllHSN);
Hsnrouter.delete('/deleteHsn/:id', deleteHSN);

export default Hsnrouter;  