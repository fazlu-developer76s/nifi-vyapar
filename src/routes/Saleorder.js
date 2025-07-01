import express from 'express';
import {  convertSaleOrderToSaleInvoice, createSaleOrder, deleteSaleOrder, getAllSaleOrders, updateSaleOrder } from '../controller/SaleOrderController.js';

const saleorderrouter = express.Router();

saleorderrouter.post("/saleOrder",createSaleOrder);
saleorderrouter.put("/saleOrder/:id",updateSaleOrder);
saleorderrouter.post("/convertSaleordertoSale",convertSaleOrderToSaleInvoice);
saleorderrouter.get("/saleorder",getAllSaleOrders);
saleorderrouter.delete("/saleorder/delete/:id",deleteSaleOrder)

export default  saleorderrouter;