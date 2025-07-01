import express from 'express';
import { createGst, updateGst, deleteGst, getAllGst, getOurAllGst} from '../controller/GsttController.js';
import { AllvalidateSchema } from '../middlewares/userValidation.js';
import { gsttaxValidationSchema } from '../utils/valgst.js';
import { gstupdatetaxValidationSchema } from '../utils/valgst.js';
import { authorize } from '../middlewares/auth.js';

const Gstrouter = express.Router();

// Create a new GST record
Gstrouter.post('/gst/create',AllvalidateSchema(gsttaxValidationSchema),authorize,createGst);

// Get all GST records
Gstrouter.get('/gst/getall', getAllGst);

Gstrouter.get("/gst/all",authorize,getOurAllGst)
// Get a GST record by ID
// router.get('/:id', getGstById);

// Update a GST record
Gstrouter.put('/gst/update/:id', AllvalidateSchema(gstupdatetaxValidationSchema),authorize,updateGst);

// Delete a GST record
Gstrouter.delete('/gst/delete/:id', deleteGst);

export default Gstrouter;
