import express from 'express';
import { createRole,getRoles, updateRole, deleteRole } from '../controllers/role.controller.js';
import validationCheck from '../middlewares/validation.middleware.js';
import verifyToken  from '../middlewares/auth.middleware.js';
import { roleValidation } from '../utils/validation.js';

const roleRouter = express.Router();
roleRouter.post('/', verifyToken, validationCheck(roleValidation), createRole);
roleRouter.get('/', verifyToken, getRoles);
roleRouter.put('/:id',verifyToken, validationCheck(roleValidation), updateRole);
roleRouter.delete('/:id',verifyToken, deleteRole);
export default roleRouter;


