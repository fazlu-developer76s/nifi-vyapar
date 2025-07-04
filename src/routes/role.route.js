import express from 'express';
import { createRole,getRoles, updateRole, deleteRole } from '../controllers/role.controller.js';

import validationCheck from '../middlewares/validation.middleware.js';
import { roleValidation } from '../utils/validation.js';

const roleRouter = express.Router();
roleRouter.post('/create', validationCheck(roleValidation), createRole);
roleRouter.get('/', getRoles);
roleRouter.put('/:id', validationCheck(roleValidation), updateRole);
roleRouter.delete('/:id', deleteRole);
export default roleRouter;


