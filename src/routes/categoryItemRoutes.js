import express from "express";
import {
  createCategoryItem,
  getAllCategoryItems,
  getCategoryItemById,
  updateCategoryItem,
  deleteCategoryItem,
  getOurAllCategoryItems,
} from "../controller/categoryItemController.js";
import { AllvalidateSchema } from "../middlewares/userValidation.js";
import { categoryItemValidationSchema } from "../utils/valgst.js";
import { authorize } from "../middlewares/auth.js";

const CategoryItemrouter = express.Router();

CategoryItemrouter.post(
  "/items/create",
  AllvalidateSchema(categoryItemValidationSchema),
  authorize,
  createCategoryItem
);
CategoryItemrouter.get("/items/getAll", getAllCategoryItems);
CategoryItemrouter.get("/items/get-our", authorize, getOurAllCategoryItems);
CategoryItemrouter.get("/category-item/:id", getCategoryItemById);
CategoryItemrouter.put(
  "/items/update/:id",
  AllvalidateSchema(categoryItemValidationSchema),
  authorize,
  updateCategoryItem
);
CategoryItemrouter.delete("/items/delete/:id", deleteCategoryItem);

export default CategoryItemrouter;
