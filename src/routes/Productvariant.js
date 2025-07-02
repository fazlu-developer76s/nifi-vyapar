import express from 'express';
import { CreateProductVariant, DeleteProductVariant, GetAllProductVariants, UpdateProductVariant } from '../controller/ProductvariantController.js';
import { AllvalidateSchema } from '../middlewares/userValidation.js';
import { productVariantSchema, updateproductVariantSchema } from '../utils/valgst.js';
import { authorize } from '../middlewares/auth.js';

const productVariantRouter = express.Router();

productVariantRouter.post("/variants",AllvalidateSchema(productVariantSchema),authorize,CreateProductVariant);
productVariantRouter.put("/variants/:id",AllvalidateSchema(updateproductVariantSchema),authorize,UpdateProductVariant);
productVariantRouter.get("/Allvariants",authorize,GetAllProductVariants);
productVariantRouter.delete("/Deletevariants/:id",DeleteProductVariant);

export default productVariantRouter;