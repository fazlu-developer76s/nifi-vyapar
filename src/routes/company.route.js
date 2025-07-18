import express from 'express';


import verifyToken from '../middlewares/auth.middleware.js';
import { companyValidation } from '../utils/validation.js';
import validationCheck from '../middlewares/validation.middleware.js';
import { createCompany, deleteCompany, getCompanies, updateCompany } from '../controllers/company.controller.js';

const companiesRouter = express.Router();

companiesRouter.post('/', verifyToken, validationCheck(companyValidation), createCompany);
companiesRouter.get('/', verifyToken, getCompanies);
companiesRouter.put('/:id', verifyToken,  updateCompany);
companiesRouter.delete('/:id',verifyToken, deleteCompany); 

export default companiesRouter;

