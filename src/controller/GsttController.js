import Gst from '../models/Gst.js';  // Assuming the model is in this file path
import { errorResponse, successResponse } from '../lib/reply.js'; // Correcting the import
import { encryptData, decryptData } from '../lib/encrypt.js'; // Correcting the import


//     try {
//         const{body}=req.body

//       // Decrypt the request body
//       const { label, rate } = JSON.parse(decryptData(body));
  
//       // Check if both 'label' and 'rate' are provided
//       if (!label || label.trim() === "") {
//         return res.status(400).json(errorResponse(400, "GST label is required", false));
//       }
  
//       if (!rate || rate.trim() === "") {
//         return res.status(400).json(errorResponse(400, "GST rate is required", false));
//       }
  
//       // Check for duplicate GST label
//       const existingGst = await Gst.find();
//       const isDuplicate = existingGst.some(gst => {
//         const decryptedLabel = decryptData(gst.label);
        
//         // Log the decrypted label to check its format
//         console.log("Decrypted label:", decryptedLabel);
        
//         if (typeof decryptedLabel !== 'string') {
//           throw new Error('Decrypted label is not a valid string');
//         }
//         return decryptedLabel.trim().toLowerCase() === label.trim().toLowerCase();
//       });
  
//       if (isDuplicate) {
//         return res.status(409).json(errorResponse(409, "GST label already exists", false));
//       }
  
//       // Encrypt the label and rate before saving
//       const encryptedLabel = encryptData(label).encryptedData;
//       const encryptedRate = encryptData(rate.toString()).encryptedData;
  
//       // Log the encrypted label and rate
//       console.log("Encrypted label:", encryptedLabel);
//       console.log("Encrypted rate:", encryptedRate);
  
//       // Create new GST record
//       const newGst = await Gst.create({
//         label: encryptedLabel,
//         rate: encryptedRate
//       });
  
//       // Return success response
//       return res.status(201).json(
//         successResponse(201, "GST record created successfully", null, true, {
//           id: newGst._id,
//           label: label,  // Optionally decrypt the label if needed
//           rate: rate,    // Optionally decrypt the rate if needed
//         })
//       );
//     } catch (error) {
//       console.error("Create GST Error:", error);
//       return res.status(500).json(errorResponse(500, error.message, false, "Internal server error"));
//     }
//   };
  
//   export const getAllGst = async (req, res) => {
//     try {
//       // Fetch all GST records
//       const gstRecords = await Gst.find().sort({ createdAt: -1 });
  
//       // Decrypt and format the result
//       const result = gstRecords.map(gst => ({
//         _id: gst._id,
//         label: decryptData(gst.label),
//         rate: decryptData(gst.rate),
//         createdAt: gst.createdAt,
//         updatedAt: gst.updatedAt,
//       }));
  
//       return res.status(200).json(successResponse(200, "GST records fetched successfully", null, true, result));
//     } catch (error) {
//       console.error("Fetch GST Error:", error);
//       return res.status(500).json(errorResponse(500, error.message, false, "Internal server error"));
//     }
//   };
//   export const updateGst = async (req, res) => {
//     try {
//       const { body } = req.body;
//       const { id, label, rate } = JSON.parse(decryptData(body));
  
//       // Check if 'id', 'label', and 'rate' are provided
//       if (!id || !label || label.trim() === "") {
//         return res.status(400).json(errorResponse(400, "ID and label are required", false));
//       }
  
//       if (!rate || rate.trim() === "") {
//         return res.status(400).json(errorResponse(400, "Rate is required", false));
//       }
  
//       // Check if the GST record exists
//       const gstRecord = await Gst.findById(id);
//       if (!gstRecord) {
//         return res.status(404).json(errorResponse(404, "GST record not found", false));
//       }
  
//       // Check for duplicate label (excluding the current record)
//       const existingGst = await Gst.findOne({ label });
//       if (existingGst && existingGst._id.toString() !== id) {
//         return res.status(409).json(errorResponse(409, "GST label already exists", false));
//       }
  
//       // Encrypt the updated label and rate before saving
//       const encryptedLabel = encryptData(label)?.encryptedData;
//       const encryptedRate = encryptData(rate.toString())?.encryptedData;
  
//       // Update the GST record
//       const updatedGst = await Gst.findByIdAndUpdate(id, { label: encryptedLabel, rate: encryptedRate }, { new: true });
  
//       return res.status(200).json(successResponse(200, "GST record updated successfully", null, true, {
//         id: updatedGst._id,
//         label: decryptData(updatedGst.label),  // Optionally decrypt the label
//         rate: decryptData(updatedGst.rate),    // Optionally decrypt the rate
//       }));
//     } catch (error) {
//       console.error("Update GST Error:", error);
//       return res.status(500).json(errorResponse(500, error.message, false, "Internal server error"));
//     }
//   };
//   export const deleteGst = async (req, res) => {
//     try {
//       const { body } = req.body;
//       const { id } = JSON.parse(decryptData(body));
  
//       // Check if 'id' is provided
//       if (!id) {
//         return res.status(400).json(errorResponse(400, "ID is required", false));
//       }
  
//       // Find and delete the GST record by ID
//       const deletedGst = await Gst.findByIdAndDelete(id);
  
//       if (!deletedGst) {
//         return res.status(404).json(errorResponse(404, "GST record not found", false));
//       }
  
//       return res.status(200).json(successResponse(200, "GST record deleted successfully", null, true));
//     } catch (error) {
//       console.error("Delete GST Error:", error);
//       return res.status(500).json(errorResponse(500, error.message, false, "Internal server error"));
//     }
//   };
// export const createGst = async (req, res) => {
//   try {
//     const { body } = req.body;
//     const { name, rate, status = "active" } = JSON.parse(decryptData(body));

//     if (!name || !rate) {
//       return res.status(400).json(errorResponse(400, "Name and rate are required", false));
//     }

//     const existing = await Gst.find();
//     const isDuplicate = existing.some(item =>
//       JSON.parse(decryptData(item.name)).trim().toLowerCase() === name.trim().toLowerCase()
//     );

//     if (isDuplicate) {
//       return res.status(409).json(errorResponse(409, "GST with this name already exists", false));
//     }

//     const encryptedName = encryptData(JSON.stringify(name))?.encryptedData;
//     const encryptedRate = encryptData(JSON.stringify(rate))?.encryptedData;
//     const encryptedStatus = encryptData(status)?.encryptedData;

//     const newGst = await Gst.create({
//       name: encryptedName,
//       rate: encryptedRate,
//       status: encryptedStatus,
//     });

//     return res.status(201).json(successResponse(201, "GST created successfully", null, true, {
//       id: newGst._id,
//     }));
//   } catch (error) {
//     console.error("Create GST Error:", error);
//     return res.status(500).json(errorResponse(500, error.message, false));
//   }
// };

// // GET ALL GSTs
// export const getAllGst = async (req, res) => {
//   try {
//     const gstList = await Gst.find().sort({ createdAt: -1 });

//     const formatted = gstList.map(item => ({
//       _id: item._id,
//       name: JSON.parse(decryptData(item.name)),
//       rate: JSON.parse(decryptData(item.rate)),
//       status:JSON.parse(decryptData(item.status)),
//       createdAt: item.createdAt,
//       updatedAt: item.updatedAt,
//     }));

//     return res.status(200).json(successResponse(200, "GST list fetched", null, true, formatted));
//   } catch (error) {
//     console.error("Fetch GST Error:", error);
//     return res.status(500).json(errorResponse(500, error.message, false));
//   }
// };

// // UPDATE GST
// export const updateGst = async (req, res) => {
//   try {
//     const { body } = req.body;
//     const { id, name, rate, status } = JSON.parse(decryptData(body));

//     if (!id || !name || !rate) {
//       return res.status(400).json(errorResponse(400, "ID, name and rate are required", false));
//     }

//     const existing = await Gst.find();
//     const isDuplicate = existing.some(item =>
//       item._id.toString() !== id &&
//       JSON.parse(decryptData(item.name)).trim().toLowerCase() === name.trim().toLowerCase()
//     );

//     if (isDuplicate) {
//       return res.status(409).json(errorResponse(409, "GST with this name already exists", false));
//     }

//     const encryptedName = encryptData(JSON.stringify(name))?.encryptedData;
//     const encryptedRate = encryptData(JSON.stringify(rate))?.encryptedData;
//     const encryptedStatus = encryptData(status)?.encryptedData;

//     const updated = await Gst.findByIdAndUpdate(id, {
//       name: encryptedName,
//       rate: encryptedRate,
//       status: encryptedStatus,
//     }, { new: true });

//     return res.status(200).json(successResponse(200, "GST updated", null, true, {
//       id: updated._id,
//     }));
//   } catch (error) {
//     console.error("Update GST Error:", error);
//     return res.status(500).json(errorResponse(500, error.message, false));
//   }
// };

// // DELETE GST
// export const deleteGst = async (req, res) => {
//   try {
//     const { body } = req.body;
//     const { id } = JSON.parse(decryptData(body));

//     if (!id) {
//       return res.status(400).json(errorResponse(400, "ID is required", false));
//     }

//     const deleted = await Gst.findByIdAndDelete(id);
//     if (!deleted) {
//       return res.status(404).json(errorResponse(404, "GST not found", false));
//     }

//     return res.status(200).json(successResponse(200, "GST deleted", null, true));
//   } catch (error) {
//     console.error("Delete GST Error:", error);
//     return res.status(500).json(errorResponse(500, error.message, false));
//   }
// }; 
// CREATE GST
// export const createGst = async (req, res) => {
//   try {
//     // const { body } = req.body;
//     const user = req.user
//     const { label, rate, status = "active" } = req.decryptedBody;

//     if (!label || !rate) {
//       return res.status(400).json(errorResponse(400, "Label and rate are required", false));
//     }

//     const existing = await Gst.find({userId:user});
//     const isDuplicate = existing.some(item =>
//      decryptData(item.label).trim().toLowerCase() === label.trim().toLowerCase()
//     );

//     if (isDuplicate) {
//       return res.status(409).json(errorResponse(409, "GST with this label already exists", false));
//     }

//     // Encrypt data
//     const encryptedLabel = encryptData(label.trim())?.encryptedData;
//     const encryptedRate = encryptData(rate.trim())?.encryptedData;
   

//     // Create new GST record
//     const newGst = await Gst.create({
//       label: encryptedLabel,
//       rate: encryptedRate,
//       status: status,
//       userId:user
//     });

//     return res.status(201).json(successResponse(201, "GST created successfully", null, true, {
//       id: newGst._id,
//     }));
//   } catch (error) {
//     console.error("Create GST Error:", error);
//     return res.status(500).json(errorResponse(500, error.message, false));
//   }
// };

export const createGst = async (req, res) => {
  try {
    const user = req.user;
    const { label, rate, status = "active" } = req.decryptedBody;

    if (!label || !rate) {
      return res
        .status(400)
        .json(errorResponse(400, "Label and rate are required", false));
    }

    // Encrypt data
    const encryptedLabel = encryptData(label.trim())?.encryptedData;
    const encryptedRate = encryptData(rate.trim())?.encryptedData;

    // Create new GST record
    const newGst = await Gst.create({
      label: encryptedLabel,
      rate: encryptedRate,
      status: status,
      userId: user,
    });

    return res
      .status(201)
      .json(
        successResponse(201, "GST created successfully", null, true, {
          id: newGst._id,
        })
      );
  } catch (error) {
    console.error("Create GST Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, error.message, false));
  }
};

// GET ALL GSTs
export const getAllGst = async (req, res) => {
  try {
    const gstList = await Gst.find().sort({ createdAt: -1 });

    const formatted = gstList.map(item => ({
      _id: item._id,
      label: decryptData(item.label),
      rate: decryptData(item.rate),
      status:item.status,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    return res.status(200).json(successResponse(200, "GST list fetched", null, true, formatted));
  } catch (error) {
    console.error("Fetch GST Error:", error);
    return res.status(500).json(errorResponse(500, error.message, false));
  }
};

export const getOurAllGst = async (req, res) => {
  try {
    const user = req.user
    const gstList = await Gst.find({userId:user}).sort({ createdAt: -1 });

    const formatted = gstList.map(item => ({
      _id: item._id,
      label: decryptData(item.label),
      rate: decryptData(item.rate),
      status:item.status,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    return res.status(200).json(successResponse(200, "GST list fetched", null, true, formatted));
  } catch (error) {
    console.error("Fetch GST Error:", error);
    return res.status(500).json(errorResponse(500, error.message, false));
  }
};


// UPDATE GST
export const updateGst = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { label, rate, status } = req.decryptedBody;

    if (!label || !rate) {
      return res
        .status(400)
        .json(errorResponse(400, "Label and rate are required", false));
    }

    // Encrypt data
    const encryptedLabel = encryptData(label.trim())?.encryptedData;
    const encryptedRate = encryptData(rate.trim())?.encryptedData;

    // Update GST record
    const updated = await Gst.findByIdAndUpdate(
      id,
      {
        label: encryptedLabel,
        rate: encryptedRate,
        status: status,
      },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json(errorResponse(404, "GST not found", false));
    }

    return res
      .status(200)
      .json(
        successResponse(200, "GST updated", null, true, {
          id: updated._id,
        })
      );
  } catch (error) {
    console.error("Update GST Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, error.message, false));
  }
};


// DELETE GST
export const deleteGst = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json(errorResponse(400, "ID is required", false));
    }

    const deleted = await Gst.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json(errorResponse(404, "GST not found", false));
    }

    return res.status(200).json(successResponse(200, "GST deleted", null, true));
  } catch (error) {
    console.error("Delete GST Error:", error);
    return res.status(500).json(errorResponse(500, error.message, false));
  }
};

