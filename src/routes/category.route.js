import express from 'express';
import { createCategory,getCategorys, updateCategory, deleteCategory } from '../controllers/category.controller.js';
import validationCheck from '../middlewares/validation.middleware.js';
import verifyToken  from '../middlewares/auth.middleware.js';
import { categoryValidation } from '../utils/validation.js';

const categoryRouter = express.Router();
categoryRouter.post('/', verifyToken, validationCheck(categoryValidation), createCategory);
categoryRouter.get('/', verifyToken, getCategorys);
categoryRouter.put('/:id',verifyToken, validationCheck(categoryValidation), updateCategory);
categoryRouter.delete('/:id',verifyToken, deleteCategory);
export default categoryRouter;


