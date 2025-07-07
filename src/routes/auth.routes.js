import router from 'express';
import { signinWithgoogle , sendOtp , signInFunction } from '../controllers/auth.controller.js';
import validationCheck from '../middlewares/validation.middleware.js';
import { loginValidation , sendLoginOtp , signInValidation } from '../utils/validation.js';
const authRouter = router.Router();
authRouter.post('/signin-with-google', validationCheck(loginValidation) , signinWithgoogle);
authRouter.post('/signin', validationCheck(signInValidation) , signInFunction);
authRouter.post('/send-otp', validationCheck(sendLoginOtp) , sendOtp);

export default authRouter;