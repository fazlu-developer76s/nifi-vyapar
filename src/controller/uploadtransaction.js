import { uploadToCloudinary } from "../utils/cloudinary.js";


export const uploadTransactionFile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }

    const cloudinaryUrl = await uploadToCloudinary(file.path);

   
    res.status(200).json({
      success: true,
      url: cloudinaryUrl,
      fileType: file.mimetype,
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
