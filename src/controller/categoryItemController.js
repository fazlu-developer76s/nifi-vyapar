import CategoryItem from "../models/CatagoryItem.js";
import { errorResponse, successResponse } from "../lib/reply.js";
import { encryptData, decryptData } from "../lib/encrypt.js";
import mongoose from "mongoose";
// export const createCategoryItem = async (req, res) => {
//     try {
//       const { body } = req.body;
//       const { name } = JSON.parse(decryptData(body));

//       if (!name) {
//         return res.status(400).json(errorResponse(400, "Category Item name is required", false));
//       }

//       const items = await CategoryItem.find();
//       const isDuplicate = items.some(item => {
//         const decryptedName = JSON.parse(decryptData(item.name));
//         return decryptedName.trim().toLowerCase() === name.trim().toLowerCase();
//       });

//       if (isDuplicate) {
//         return res.status(409).json(errorResponse(409, "Category Item already exists", false));
//       }

//       const encryptedName = encryptData(JSON.stringify(name))?.encryptedData;

//       const newItem = await CategoryItem.create({ name: encryptedName,status: "active" });

//       return res.status(201).json(
//         successResponse(201, "Category Item created successfully", null, true, {
//           id: newItem._id,
//         })
//       );
//     } catch (error) {
//       console.error("Create CategoryItem Error:", error);
//       return res.status(500).json(errorResponse(500, error.message, false, "Internal server error"));
//     }
//   };

//   export const getAllCategoryItems = async (req, res) => {
//     try {
//       const items = await CategoryItem.find().sort({ createdAt: -1 });

//       const decryptedItems = items.map(item => ({
//         _id: item._id,
//         name: JSON.parse(decryptData(item.name)),
//         status: item.status,
//         createdAt: item.createdAt,
//         updatedAt: item.updatedAt,
//       }));

//       return res.status(200).json(
//         successResponse(200, "Category Items fetched successfully", null, true, decryptedItems)
//       );
//     } catch (error) {
//       console.error("Get CategoryItems Error:", error);
//       return res.status(500).json(errorResponse(500, error.message, false, "Internal server error"));
//     }
//   };

//   export const getCategoryItemById = async (req, res) => {
//     try {
//       const { body } = req.body;
//       const { id } = JSON.parse(decryptData(body));

//       const item = await CategoryItem.findById(id);

//       if (!item) {
//         return res.status(404).json(errorResponse(404, "Category Item not found", false));
//       }

//       const decryptedItem = {
//         _id: item._id,
//         name: JSON.parse(decryptData(item.name)),
//         createdAt: item.createdAt,
//         updatedAt: item.updatedAt,
//       };

//       return res.status(200).json(
//         successResponse(200, "Category Item fetched successfully", null, true, decryptedItem)
//       );
//     } catch (error) {
//       console.error("Get CategoryItem Error:", error);
//       return res.status(500).json(errorResponse(500, error.message, false, "Internal server error"));
//     }
//   };

//   export const updateCategoryItem = async (req, res) => {
//     try {
//       const { body } = req.body;
//       const { id, name, status } = JSON.parse(decryptData(body));

//       // Encrypt the name if it's provided
//       const encryptedName = name ? encryptData(JSON.stringify(name))?.encryptedData : undefined;

//       // Prepare the update object. If name is undefined, status could still be updated
//       const updateData = {
//         ...(encryptedName && { name: encryptedName }), // Only include if name is provided
//         ...(status && { status }) // Update status if it's provided
//       };

//       // Perform the update operation
//       const updated = await CategoryItem.findByIdAndUpdate(id, updateData, { new: true });

//       if (!updated) {
//         return res.status(404).json(errorResponse(404, "Category Item not found", false));
//       }

//       const decryptedUpdated = {
//         _id: updated._id,
//         name: name ? JSON.parse(decryptData(updated.name)) : undefined,
//         status: updated.status, // Status is plain text
//         createdAt: updated.createdAt,
//         updatedAt: updated.updatedAt,
//       };

//       return res.status(200).json(
//         successResponse(200, "Category Item updated successfully", null, true, decryptedUpdated)
//       );
//     } catch (error) {
//       console.error("Update CategoryItem Error:", error);
//       return res.status(500).json(errorResponse(500, error.message, false, "Internal server error"));
//     }
//   };
//   export const deleteCategoryItem = async (req, res) => {
//     try {
//       const { body } = req.body;
//       const { id } = JSON.parse(decryptData(body));

//       const deleted = await CategoryItem.findByIdAndDelete(id);

//       if (!deleted) {
//         return res.status(404).json(errorResponse(404, "Category Item not found", false));
//       }

//       const decryptedDeleted = {
//         _id: deleted._id,
//         name: JSON.parse(decryptData(deleted.name)),
//         status: deleted.status,
//         createdAt: deleted.createdAt,
//         updatedAt: deleted.updatedAt,
//       };

//       return res.status(200).json(
//         successResponse(200, "Category Item deleted successfully", null, true, decryptedDeleted)
//       );
//     } catch (error) {
//       console.error("Delete CategoryItem Error:", error);
//       return res.status(500).json(errorResponse(500, error.message, false, "Internal server error"));
//     }
//   };
// export const createCategoryItem = async (req, res) => {
//   try {
//     const { body } = req.body;
//     const { name } = JSON.parse(decryptData(body));

//     // Check if 'name' is provided
//     if (!name || name.trim() === "") {
//       return res.status(400).json(errorResponse(400, "Category Item name is required", false));
//     }

//     // Check for duplicate category item name
//     const items = await CategoryItem.find();
//     const isDuplicate = items.some(item => {
//       const decryptedName = JSON.parse(decryptData(item.name));
//       return decryptedName.trim().toLowerCase() === name.trim().toLowerCase();
//     });

//     if (isDuplicate) {
//       return res.status(409).json(errorResponse(409, "Category Item already exists", false));
//     }

//     // Encrypt the name before saving
//     const encryptedName = encryptData(JSON.stringify(name))?.encryptedData;

//     // Create new category item
//     const newItem = await CategoryItem.create({ name: encryptedName, status: "active" });

//     // Return success response
//     return res.status(201).json(
//       successResponse(201, "Category Item created successfully", null, true, {
//         id: newItem._id,
//       })
//     );
//   } catch (error) {
//     console.error("Create CategoryItem Error:", error);
//     return res.status(500).json(errorResponse(500, error.message, false, "Internal server error"));
//   }
// };

export const createCategoryItem = async (req, res) => {
  try {
    const user = req.user;
    console.log(user , 'asdfasfd')
   
    
    // const { body } = req.body;
    const { name, status } = req.decryptedBody;

    // Check if 'name' is provided
    if (!name || name.trim() === "") {
      return res
        .status(400)
        .json(errorResponse(400, "Category Item name is required", false));
    }

    // Check for duplicate category item name
    const items = await CategoryItem.find({userId:user});
    const isDuplicate = items.some((item) => {
      const decryptedName = decryptData(item.name);
      return decryptedName.trim().toLowerCase() === name.trim().toLowerCase();
    });

    if (isDuplicate) {
      return res
        .status(409)
        .json(errorResponse(409, "Category Item already exists", false));
    }

    // Set default status if not provided
    const finalStatus = status || "active";

    // Encrypt the name before saving
    const encryptedName = encryptData(name)?.encryptedData;

    // Create new category item
    const newItem = await CategoryItem.create({
      name: encryptedName,
      status: finalStatus,
      userId: user,
    });

    // Return success response
    return res.status(201).json(
      successResponse(201, "Category Item created successfully", null, true, {
        id: newItem._id,
      })
    );
  } catch (error) {
    console.error("Create CategoryItem Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, "something went wrong", false, ));
  }
};

export const updateCategoryItem = async (req, res) => {
  try {
   const user = req.user
    const { id } = req.params;
    // const { body } = req.body;
    const { name, status } = req.decryptedBody;

    if (!id) {
      return res
        .status(400)
        .json(errorResponse(400, "Category Item id is required", false));
    }

    if (name && name.trim() === "") {
      return res
        .status(400)
        .json(errorResponse(400, "Category Item name cannot be empty", false));
    }

    if (name) {
      const items = await CategoryItem.find({ _id: { $ne: id },userId:user }); // Exclude the current item
      const isDuplicate = items.some((item) => {
        const decryptedName = decryptData(item.name);
        return decryptedName.trim().toLowerCase() === name.trim().toLowerCase();
      });

      if (isDuplicate) {
        return res
          .status(409)
          .json(errorResponse(409, "Category Item name already exists", false));
      }
    }

    const updateData = {
      ...(name && { name: encryptData(name)?.encryptedData }),
      ...(status && { status }),
      
    };

    const updated = await CategoryItem.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updated) {
      return res
        .status(404)
        .json(errorResponse(404, "Category Item not found", false));
    }

    const decryptedUpdated = {
      _id: updated._id,
      name: name ? decryptData(updated.name) : undefined,
      status: updated.status,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
      
    };

    return res
      .status(200)
      .json(
        successResponse(
          200,
          "Category Item updated successfully",
          null,
          true,
          decryptedUpdated
        )
      );
  } catch (error) {
    console.error("Update CategoryItem Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, "something went wrong ", false));
  }
};

export const getAllCategoryItems = async (req, res) => {
  try {
    // Fetch all category items from the database
    const items = await CategoryItem.find().sort({ createdAt: -1 }); // Sort by createdAt in descending order

    // Check if items exist
    if (items.length === 0) {
      return res
        .status(404)
        .json(errorResponse(404, "No Category Items found", false));
    }

    const decryptedItems = items.map((item) => ({
      _id: item._id,
      name: decryptData(item.name),
      status: item.status,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    return res
      .status(200)
      .json(
        successResponse(
          200,
          "Category Items fetched successfully",
          null,
          true,
          decryptedItems
        )
      );
  } catch (error) {
    console.error("Get CategoryItems Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, error.message, false, "Internal server error"));
  }
};

export const getOurAllCategoryItems = async (req, res) => {
  try {
    const user = req.user;
   

    const items = await CategoryItem.find({ userId: user }).sort({
      createdAt: -1,
    });

    if (items.length === 0) {
      return res
        .status(404)
        .json(errorResponse(404, "No Category Items found", false));
    }

    const decryptedItems = items.map((item) => ({
      _id: item._id,
      name: decryptData(item.name),
      status: item.status,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      
    }));

    return res
      .status(200)
      .json(
        successResponse(
          200,
          "Category Items fetched successfully",
          null,
          true,
          decryptedItems
        )
      );
  } catch (error) {
    console.error("Get CategoryItems Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, "something went wrong ", false));
  }
};

export const getCategoryItemById = async (req, res) => {
  try {
    // Extract the ID from the URL params
    const { id } = req.params; // The ID should be in the URL params like /category-item/:id

    // Check if the id is valid
    if (!id || !mongoose.isValidObjectId(id)) {
      return res
        .status(400)
        .json(errorResponse(400, "Invalid or missing Category Item ID", false));
    }

    // Fetch the category item by ID
    const item = await CategoryItem.findById(id);

    // If the item is not found, return a 404 error
    if (!item) {
      return res
        .status(404)
        .json(errorResponse(404, "Category Item not found", false));
    }

    // Decrypt the category item name (if encrypted)
    const decryptedItem = {
      _id: item._id,
      name: JSON.parse(decryptData(item.name)), // Decrypt the name
      status: item.status,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };

    // Send the decrypted category item details in the response
    return res
      .status(200)
      .json(
        successResponse(
          200,
          "Category Item fetched successfully",
          null,
          true,
          decryptedItem
        )
      );
  } catch (error) {
    return res
    .status(500)
    .json(errorResponse(500, "something went wrong ", false));
}
};

// export const deleteCategoryItem = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!id) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Category Item id is required", false));
//     }

//     const deleted = await CategoryItem.findByIdAndDelete(id);

//     if (!deleted) {
//       return res
//         .status(404)
//         .json(errorResponse(404, "Category Item not found", false));
//     }

//     const decryptedDeleted = {
//       _id: deleted._id,
//       name: JSON.parse(decryptData(deleted.name)),
//       status: deleted.status,
//       createdAt: deleted.createdAt,
//       updatedAt: deleted.updatedAt,
//     };

//     return res
//       .status(200)
//       .json(
//         successResponse(
//           200,
//           "Category Item deleted successfully",
//           null,
//           true,
//           decryptedDeleted
//         )
//       );
//   } catch (error) {
//     console.error("Delete CategoryItem Error:", error);
//     return res
//     .status(500)
//     .json(errorResponse(500, "something went wrong ", false));
// }
// };

export const deleteCategoryItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json(errorResponse(400, "Category Item ID is required", false));
    }

    const deleted = await CategoryItem.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json(errorResponse(404, "Category Item not found", false));
    }

    const decryptedDeleted = {
      _id: deleted._id,
      name: decryptData(deleted.name), // ✅ FIXED: removed JSON.parse
      status: deleted.status,
      createdAt: deleted.createdAt,
      updatedAt: deleted.updatedAt,
    };

    return res
      .status(200)
      .json(
        successResponse(
          200,
          "Category Item deleted successfully",
          null,
          true,
          decryptedDeleted
        )
      );
  } catch (error) {
    console.error("Delete CategoryItem Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false));
  }
};
