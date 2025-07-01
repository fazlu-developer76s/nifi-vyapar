import { decryptData, encryptData } from "../lib/encrypt.js";
import { errorResponse, successResponse } from "../lib/reply.js";
import PermissionSubCategory from "../models/subCategoryPermission.js"




// export const createPermissionSubCategory = async (req, res) => {
//     try {
//       const { title, categoryId, status } = req.decryptedBody;
  
//       // Validate title and categoryId
//       if (!title || title.trim() === "") {
//         return res.status(400).json(errorResponse(400, "Permission Sub-Category title is required", false));
//       }
  
//       if (!categoryId) {
//         return res.status(400).json(errorResponse(400, "Category ID is required", false));
//       }
  
//       // Check for duplicate title in the same category
//       const subCategories = await PermissionSubCategory.find();
//       const isDuplicate = subCategories.some(subCategory => {
//         try {
//           const decryptedTitle = JSON.parse(decryptData(subCategory.title));
//           return decryptedTitle.trim().toLowerCase() === title.trim().toLowerCase() && subCategory.categoryId.toString() === categoryId;
//         } catch (err) {
//           console.warn(`Decryption failed for sub-category ${subCategory._id}:`, err.message);
//           return false; // Ignore corrupted entries
//         }
//       });
  
//       if (isDuplicate) {
//         return res.status(409).json(errorResponse(409, "Permission Sub-Category already exists in the selected category", false));
//       }
  
//       // Encrypt the title
//       const encryptedTitle = encryptData(JSON.stringify(title))?.encryptedData;
//       if (!encryptedTitle) {
//         return res.status(500).json(errorResponse(500, "Encryption failed", false));
//       }
  
//       // Set default status
//       const finalStatus = status || "active";
  
//       // Create the new sub-category
//       const newSubCategory = await PermissionSubCategory.create({
//         title: encryptedTitle,
//         categoryId,
//         status: finalStatus,
//       });
  
//       return res.status(201).json(
//         successResponse(201, "Permission Sub-Category created successfully", null, true, {
//           id: newSubCategory._id,
//         })
//       );
//     } catch (error) {
//       console.error("Create PermissionSubCategory Error:", error);
//       return res.status(500).json(errorResponse(500, error.message, false, "Internal server error"));
//     }
//   }; 

export const createPermissionSubCategory = async (req, res) => {
    try {
      const user=req.user
      const { title, categoryId, status } = req.decryptedBody;
  
      // Validate title and categoryId
      if (!title || title.trim() === "") {
        return res.status(400).json(errorResponse(400, "Permission Sub-Category title is required", false));
      }
  
      if (!categoryId) {
        return res.status(400).json(errorResponse(400, "Category ID is required", false));
      }
  
      // Check for duplicate title in the same category
      const subCategories = await PermissionSubCategory.find({userId:user});
      const isDuplicate = subCategories.some(subCategory => {
        try {
          const decryptedTitle = JSON.parse(decryptData(subCategory.title));
          return decryptedTitle.trim().toLowerCase() === title.trim().toLowerCase() && subCategory.categoryId.toString() === categoryId;
        } catch (err) {
          console.warn(`Decryption failed for sub-category ${subCategory._id}:`, err.message);
          return false; // Ignore corrupted entries
        }
      });
  
      if (isDuplicate) {
        return res.status(409).json(errorResponse(409, "Permission Sub-Category already exists in the selected category", false));
      }
  
      // Encrypt the title
      const encryptedTitle = encryptData(JSON.stringify(title))?.encryptedData;
      if (!encryptedTitle) {
        return res.status(500).json(errorResponse(500, "Encryption failed", false));
      }
  
      // Set default status
      const finalStatus = status || "active";
  
      // Create the new sub-category
      const newSubCategory = await PermissionSubCategory.create({
        title: encryptedTitle,
        categoryId,
        status: finalStatus,
        userId:user
      });
  
      return res.status(201).json(
        successResponse(201, "Permission Sub-Category created successfully", null, true, {
          id: newSubCategory._id,
        })
      );
    } catch (error) {
      console.error("Create PermissionSubCategory Error:", error);
      return res.status(500).json(errorResponse(500, error.message, false, "Internal server error"));
    }
  };
  
  
  export const updatePermissionSubCategory = async (req, res) => {
    try {
      const user = req.user
      const { id } = req.params;
      const { title, categoryId, status } = req.decryptedBody;
  
      if (!id) {
        return res.status(400).json(errorResponse(400, "Permission Sub-Category ID is required", false));
      }
  
      const subCategory = await PermissionSubCategory.findById(id);
      if (!subCategory) {
        return res.status(404).json(errorResponse(404, "Permission Sub-Category not found", false));
      }
  
      // Check for duplicate title if title is being updated
      if (title) {
        const others = await PermissionSubCategory.find({ _id: { $ne: id },userId:user });
  
        const isDuplicate = others.some(item => {
          try {
            const decryptedTitleRaw = decryptData(item.title);
            const decryptedTitle = JSON.parse(decryptedTitleRaw || '""');
  
            return (
              decryptedTitle?.trim().toLowerCase() === title.trim().toLowerCase()
            );
          } catch (err) {
            console.error("Decryption failed for title:", item.title, err.message);
            return false;
          }
        });
  
        if (isDuplicate) {
          return res.status(409).json(errorResponse(409, "Permission Sub-Category title already exists", false));
        }
  
        subCategory.title = encryptData(JSON.stringify(title))?.encryptedData;
      }
  
      if (categoryId) subCategory.categoryId = categoryId;
      if (status) subCategory.status = status;
  
      await subCategory.save();
  
      return res.status(200).json(
        successResponse(200, "Permission Sub-Category updated successfully", null, true, {
          id: subCategory._id,
        })
      );
    } catch (error) {
      console.error("Update PermissionSubCategory Error:", error);
      return res.status(500).json(errorResponse(500, error.message, false, "Internal server error"));
    }
  };
  


  export const getAllPermissionSubCategories = async (req, res) => {
    try {
      const subCategories = await PermissionSubCategory.find().populate("categoryId");
  
      const formatted = subCategories.map(item => ({
        id: item._id,
        title: JSON.parse(decryptData(item.title)),
        categoryId: item.categoryId?._id || null,
        categoryTitle: item.categoryId ? JSON.parse(decryptData(item.categoryId.title)) : null,
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));
  
      return res.status(200).json(successResponse(200, "Fetched successfully", null, true, formatted));
    } catch (error) {
      console.error("Get PermissionSubCategories Error:", error);
      return res.status(500).json(errorResponse(500, error.message, false, "Internal server error"));
    }
  };

  export const getOurAllPermissionSubCategories = async (req, res) => {
    try {
      const user=req.user
      const subCategories = await PermissionSubCategory.find({userId:user}).populate("categoryId");
  
      const formatted = subCategories.map(item => ({
        id: item._id,
        title: JSON.parse(decryptData(item.title)),
        categoryId: item.categoryId?._id || null,
        categoryTitle: item.categoryId ? JSON.parse(decryptData(item.categoryId.title)) : null,
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));
  
      return res.status(200).json(successResponse(200, "Fetched successfully", null, true, formatted));
    } catch (error) {
      console.error("Get PermissionSubCategories Error:", error);
      return res.status(500).json(errorResponse(500, error.message, false, "Internal server error"));
    }
  };



  export const deletePermissionSubCategory = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).json(errorResponse(400, "Permission Sub-Category ID is required", false));
      }
  
      const subCategory = await PermissionSubCategory.findById(id);
      if (!subCategory) {
        return res.status(404).json(errorResponse(404, "Permission Sub-Category not found", false));
      }
  
      await PermissionSubCategory.findByIdAndDelete(id);
  
      return res.status(200).json(successResponse(200, "Permission Sub-Category deleted successfully", null, true));
    } catch (error) {
      console.error("Delete PermissionSubCategory Error:", error);
      return res.status(500).json(errorResponse(500, error.message, false, "Internal server error"));
    }
  }; 