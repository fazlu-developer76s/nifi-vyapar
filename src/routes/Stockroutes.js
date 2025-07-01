import express from "express"
import { createStock, deleteStock, getAllStocks, getNotdefaultAllStocks, getOurAllStocks, getStockById, updateStock } from "../controller/StocktransferController.js"
import { AllvalidateSchema } from "../middlewares/userValidation.js";
import { stockValidationSchema } from "../utils/valgst.js";
import { authorize } from "../middlewares/auth.js";

const Stockroutes=express.Router()

Stockroutes.post("/stock",AllvalidateSchema(stockValidationSchema),authorize,createStock);
Stockroutes.get("/stock/all",getAllStocks);
Stockroutes.put("/stock/:id",AllvalidateSchema(stockValidationSchema),authorize,updateStock);
Stockroutes.get("/stock/:id",getStockById);
Stockroutes.delete("/stock/:id",deleteStock);
Stockroutes.get("/stock",authorize,getOurAllStocks);
Stockroutes.get("/stock/get",getAllStocks);
Stockroutes.get("/allstock",authorize,getNotdefaultAllStocks);

export default Stockroutes;