import PermissionCategory from "../models/CategoryPermission.js";
import { decryptData, encryptData } from "../lib/encrypt.js";
import { errorResponse, successResponse } from "../lib/reply.js";

export const createPermissionCategory = async (req, res) => {
  try {
    const user = req.user;
    const { title, status } = req.decryptedBody;
    // Check if 'title' is provided
    if (!title || title.trim() === "") {
      return res
        .status(400)
        .json(
          errorResponse(400, "Permission Category title is required", false)
        );
    }
    
    // Encrypt title
    const encryptedTitle = encryptData(JSON.stringify(title))?.encryptedData;
    
    // Check for duplicate title
    const categories = await PermissionCategory.findOne({title: encryptedTitle, userId: user});
    
 
    // const isDuplicate = categories.some((category) => {
    //   const decryptedTitle = JSON.parse(decryptData(category.title));
    //   return decryptedTitle.trim().toLowerCase() === title.trim().toLowerCase();
    // });

    

    if (categories != null) {
      return res
        .status(409)
        .json(errorResponse(409, "Permission Category already existsddd", false));
    }


    // Set default status
    const finalStatus = status || "active";

    // Create new category
    const newCategory = await PermissionCategory.create({
      title: encryptedTitle,
      status: finalStatus,
      userId: user,
    });

    return res.status(201).json(
      successResponse(
        201,
        "Permission Category created successfully",
        null,
        true,
        {
          id: newCategory._id,
        }
      )
    );
  } catch (error) {
    console.error("Create PermissionCategory Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, error.message, false, "Internal server error"));
  }
};

export const getAllPermissionCategories = async (req, res) => {
  try {
    const categories = await PermissionCategory.find();

    const formatted = categories.map((cat) => ({
      id: cat._id,
      title: JSON.parse(decryptData(cat.title)),
      status: cat.status,
    }));

    return res
      .status(200)
      .json(
        successResponse(
          200,
          "Permission Categories fetched successfully",
          null,
          true,
          formatted
        )
      );
  } catch (error) {
    console.error("Get All PermissionCategories Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, error.message, false, "Internal server error"));
  }
};

export const getOurAllPermissionCategories = async (req, res) => {
  try {
    const user = req.user;
    const categories = await PermissionCategory.find({ userId: user });

    const formatted = categories.map((cat) => ({
      id: cat._id,
      title: JSON.parse(decryptData(cat.title)),
      status: cat.status,
    }));

    return res
      .status(200)
      .json(
        successResponse(
          200,
          "Permission Categories fetched successfully",
          null,
          true,
          formatted
        )
      );
  } catch (error) {
    console.error("Get All PermissionCategories Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, error.message, false, "Internal server error"));
  }
};

export const updatePermissionCategory = async (req, res) => {
  try {
    const user = req.user;
    console.log(user,"who is the user")
    const { id } = req.params;
    const { title, status } = req.decryptedBody;

    if (!id) {
      return res
        .status(400)
        .json(errorResponse(400, "Permission Category ID is required", false));
    }

    const category = await PermissionCategory.findById(id);
    if (!category) {
      return res
        .status(404)
        .json(errorResponse(404, "Permission Category not found", false));
    }

    // Check for duplicate title (if it's being changed)
    if (title) {
      // const allCategories = await PermissionCategory.find({
      //   userId: user,
      //   _id: { $ne: id },
      // });
       const allCategories = await PermissionCategory.findOne({title: encryptData(JSON.stringify(title))?.encryptedData, userId: user,  _id: { $ne: id }});
// console.log(allCategories,"finding")
//       const isDuplicate = allCategories.some((cat) => {
//         const decryptedTitle = JSON.parse(decryptData(cat.title));
//         return (
//           decryptedTitle.trim().toLowerCase() === title.trim().toLowerCase()
//         );
//       });

      if (allCategories != null) {
        return res
          .status(409)
          .json(
            errorResponse(
              409,
              "Permission Category title already exists",
              false
            )
          );
      }

      category.title = encryptData(JSON.stringify(title))?.encryptedData;
    }

    if (status) category.status = status;

    await category.save();

    return res.status(200).json(
      successResponse(
        200,
        "Permission Category updated successfully",
        null,
        true,
        {
          id: category._id,
        }
      )
    );
  } catch (error) {
    console.error("Update PermissionCategory Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, error.message, false, "Internal server error"));
  }
};

export const deletePermissionCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json(errorResponse(400, "Permission Category ID is required", false));
    }

    const deleted = await PermissionCategory.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json(errorResponse(404, "Permission Category not found", false));
    }

    return res
      .status(200)
      .json(
        successResponse(
          200,
          "Permission Category deleted successfully",
          null,
          true
        )
      );
  } catch (error) {
    console.error("Delete PermissionCategory Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, error.message, false, "Internal server error"));
  }
};
