import express from 'express';
import { createCheque,deleteCheque,getAllCheques, updateCheque,getCheques } from '../controller/ChequeController.js';
import { AllvalidateSchema } from '../middlewares/userValidation.js';
import { chequeValidationSchema } from '../utils/valgst.js';
import { authorize } from '../middlewares/auth.js';
 // adjust based on your setup

const Chequerouter = express.Router();

// @route   POST /api/cheques
// @desc    Create a new cheque
// @access  Protected
Chequerouter.post('/create/cheque',AllvalidateSchema(chequeValidationSchema),authorize, createCheque);
Chequerouter.get('/Allcheques',authorize,getAllCheques)
Chequerouter.get('/gettcheques',authorize,getCheques)
Chequerouter.put('/cheque/:chequeId/:actionBy',AllvalidateSchema(chequeValidationSchema),authorize,updateCheque)
Chequerouter.delete('/cheque/delete/:id',deleteCheque)
export default Chequerouter;