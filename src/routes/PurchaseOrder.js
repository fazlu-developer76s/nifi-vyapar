import express from 'express';
import { createPurchaseOrder, generateOrderNumber, getAllPurchaseOrder,getGlobalLogs,updatePurchaseOrder } from '../controller/PurchaseOrder.js';
import PurchaseOrder from '../models/PurchaseOrder.js';
import { authorize } from '../middlewares/auth.js';

const purachseOrderRouter = express.Router();

purachseOrderRouter.post("/purchase-order",authorize,createPurchaseOrder);
purachseOrderRouter.get("/Allpurchase-order",authorize,getAllPurchaseOrder);
purachseOrderRouter.put("/purchase-order/:id",authorize,updatePurchaseOrder); // Assuming you want to update the purchase order with the same function
purachseOrderRouter.get("/generate-order",generateOrderNumber);
purachseOrderRouter.get("/getlogs",getGlobalLogs);


export default purachseOrderRouter;