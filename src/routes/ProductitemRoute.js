import express from "express";
import {
  adjustStock,
  createProduct,
  deleteProduct,
  getAllProductItems,
  getOurAllProductItems,
  getProductitemById,
  getStockDetails,
  getStockproductHistory,
  getStockproductHistoryById,
  updateProduct,
  updateStockByType,
  
} from "../controller/ProductitemController.js";
import { AllvalidateSchema } from "../middlewares/userValidation.js";
import { productValidationSchema } from "../utils/valgst.js";
import { productUpdateValidationSchema } from "../utils/valgst.js";
import { authorize } from "../middlewares/auth.js";


const Productitemrouter = express.Router();


Productitemrouter.post("/itemproduct", AllvalidateSchema(productValidationSchema),authorize,createProduct);
Productitemrouter.get("/itemproduct/all",getAllProductItems);
Productitemrouter.get("/itemproduct/:id",getProductitemById);
Productitemrouter.put("/itemproduct/:id",AllvalidateSchema(productUpdateValidationSchema),authorize,updateProduct);
Productitemrouter.delete("/itemproduct/:id",deleteProduct);
Productitemrouter.get("/itemproduct",authorize,getOurAllProductItems)
Productitemrouter.put("/itemproducts/:itemId",updateStockByType);
Productitemrouter.get("/itemproducthistory/get",getStockproductHistory);
Productitemrouter.get("/itemsstock/:itemId",getStockDetails);
Productitemrouter.get("/itemproducthistory/:itemId",getStockproductHistoryById);
Productitemrouter.post("/adjust/:itemId",adjustStock);

export default Productitemrouter;
