import express from 'express';
import { createImei } from '../controller/ImeiController.js';

const ImeiRoutes = express.Router();

ImeiRoutes.post("/imei",createImei);


export default ImeiRoutes;