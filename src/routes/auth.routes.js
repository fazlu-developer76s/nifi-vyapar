import router from 'express';
import { signinWithgoogle } from '../controllers/auth.controller.js';
import validationCheck from '../middlewares/validation.middleware.js';
import { loginValidation } from '../utils/validation.js';
const authRouter = router.Router();
authRouter.post('/signin-with-google', validationCheck(loginValidation) , signinWithgoogle);

export default authRouter;