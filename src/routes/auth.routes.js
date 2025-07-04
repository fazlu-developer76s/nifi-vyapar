import router from 'express';
import { signinWithgoogle , sendOtp } from '../controllers/auth.controller.js';
import validationCheck from '../middlewares/validation.middleware.js';
import { loginValidation , sendLoginOtp } from '../utils/validation.js';
const authRouter = router.Router();
authRouter.post('/signin-with-google', validationCheck(loginValidation) , signinWithgoogle);
authRouter.post('/signin', validationCheck(loginValidation) , signinWithgoogle);
authRouter.post('/send-otp', validationCheck(sendLoginOtp) , sendOtp);

export default authRouter;