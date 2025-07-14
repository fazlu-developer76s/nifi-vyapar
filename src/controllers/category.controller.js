import { Category } from "../models/category.model.js";
import { errorResponse, successResponse } from "../utils/response.js";

export const createCategory = async (req, res) => {
  try {
    
    const { category_name } = req.body;
    const existingCategory = await Category.findOne({ category_name:category_name , userID:req.user.id });
  
    if (existingCategory) {
      errorResponse(res, "Category already exists", 400);
      return;
    }
    const saveCategory = await Category.create({ category_name: category_name, userID: req.user.id });
    successResponse(res, "Category created successfully", saveCategory, 201);
    return;
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getCategorys = async (req, res) => {
  try {
    const category_names = await Category.find({ userID: req.user.id });
    const decryptedCategoryNames = category_names.map(category => ({
      ...category.toObject(),
      category_name: category.category_name_decrypted // Use the virtual field for decrypted name
    }));
    successResponse(res, "Categorys fetched successfully", decryptedCategoryNames, 200);
    return;
  } catch (error) {
    errorResponse(res, "Error fetching category_names", 500, error.message);
    return;
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category_nameDoc = await Category.findByIdAndUpdate(id);
    if (!category_nameDoc) {
       errorResponse(res, "Category not found", 404);
       return;
    }
    const check_category_name = await Category.findOne({
      category_name: req.body.category_name,
      userID: req.user.id,
      _id: { $ne: id },
    });
    // return console.log(check_category_name.category_name);
    if (check_category_name) {
      errorResponse(res, "Category already exists", 400);
      return;
    }
    if (req.body.status) {
      category_nameDoc.status = req.body.status;
    }
    if (req.body.category_name) {
      category_nameDoc.category_name = req.body.category_name;
    }
    await category_nameDoc.save();
    successResponse(res, "Category updated successfully", category_nameDoc, 200);
    return;
  } catch (err) {
    errorResponse(res, "Error updating category_name", 500, err.message);
    return;
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) {
      errorResponse(res, "Category not found", 404);
      return;
    }
    successResponse(res, "Category deleted successfully", deleted, 200);
    return;
  } catch (err) {
    errorResponse(res, "Error deleting category_name", 500, err.message);
    return;
  }
};
