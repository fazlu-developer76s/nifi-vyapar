import express from 'express';
import {
  createHSN,
  updateHSN,
  getAllHSN,
  deleteHSN
} from '../controller/HSNController.js';



const router = express.Router();



router.post('/Hsn/create',  createHSN);
router.put('/update/:id',  updateHSN);
router.get('/all',  getAllHSN);
router.delete('/delete/:id', deleteHSN);

export default router;  