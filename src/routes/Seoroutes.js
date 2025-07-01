import express from 'express';
import { createSeo, getSeo} from '../controller/seoController.js';
import { AllvalidateSchema } from '../middlewares/userValidation.js';
import { validateSeo } from '../utils/valgst.js';
const seoroutes = express.Router();

seoroutes.post("/seo",AllvalidateSchema(validateSeo),createSeo);
seoroutes.get("/getseo/:page",getSeo);

export default seoroutes;