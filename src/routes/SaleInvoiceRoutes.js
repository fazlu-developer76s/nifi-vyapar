import express from 'express'
import { createSaleInvoice, deleteSaleInvoice,  getSaleInvoiceById, getSaleInvoices, updateSaleInvoice } from '../controller/SaleInvoice.js';
import { AllvalidateSchema } from '../middlewares/userValidation.js';
import { saleInvoiceValidationSchema } from '../utils/valgst.js';
import { authorize } from '../middlewares/auth.js';

const saleinvoicerouter = express.Router();

saleinvoicerouter.post("/saleinvoice",createSaleInvoice);
saleinvoicerouter.put("/saleinvoice/:id",updateSaleInvoice);
saleinvoicerouter.delete("/saleinvoice/:id",deleteSaleInvoice);
saleinvoicerouter.get("/saleinvoice/get",getSaleInvoices);
saleinvoicerouter.get("/saleinv/:id",getSaleInvoiceById)
export default saleinvoicerouter