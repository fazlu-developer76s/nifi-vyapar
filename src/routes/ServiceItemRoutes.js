import express from 'express';
import {createService,getAllServices,updateService,deleteService} from '../controller/ServiceItemController.js';
import { AllvalidateSchema } from '../middlewares/userValidation.js';
import { serviceItemValidationSchema } from '../utils/valgst.js';
import { serviceUpdateItemValidationSchema } from '../utils/valgst.js';

const ServiceItemrouter = express.Router();

ServiceItemrouter.post('/Service/create',AllvalidateSchema(serviceItemValidationSchema), createService);


ServiceItemrouter.get('/Service/getAll', getAllServices);


ServiceItemrouter.put('/Service/:id',AllvalidateSchema(serviceUpdateItemValidationSchema), updateService);


ServiceItemrouter.delete('/Service/delete/:id', deleteService);

export default ServiceItemrouter;
