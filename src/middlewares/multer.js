// import multer from "multer"
// import { errorResponse } from "../lib/reply.js"

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './public')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname)
//     }
// })
// export const upload = multer({
//     storage
// })

// export const uploadimagetype = (req, res, next) => {
//     try {
//       const { type } = req.params;
  
//       if (!type) {
//         return res.status(404).json(errorResponse(404, "Type is not found", false));
//       }
  
//       if (type === "slider") {
//         upload.array('imageUrl', 12)(req, res, (err) => {
//           if (err) {
//             return res.status(400).json(errorResponse(400, "File upload failed", false));
//           }
//           next();
//         });
//       } else if (type === "Footer") {
//         upload.single('imageUrl')(req, res, (err) => {
//             if (err) {
//               return res.status(400).json(errorResponse(400, "File upload failed", false));
//             }
//         next();
//       })
      
//     }  else {
//         return res.status(400).json(errorResponse(400, "Invalid type for upload", false));
//     }
//   }catch(error){
// return res.status(500).json(errorResponse(500,"something went wrong",false))
//   }
// } 
import multer from "multer";
import { errorResponse } from "../lib/reply.js";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    // Optional: filter only image types (jpg, jpeg, png, gif)
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  }
});

export const uploadimagetype = (req, res, next) => {
  try {
    const { type } = req.params;

    if (!type) {
      return res.status(404).json(errorResponse(404, "Type is not found", false));
    }

    const uploadHandler = type === "slider"
      ? upload.array("imageUrl", 12)
      : type === "Footer"
      ? upload.single("imageUrl")
      : null;

    if (!uploadHandler) {
      return res.status(400).json(errorResponse(400, "Invalid type for upload", false));
    }

    uploadHandler(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json(errorResponse(400, "File too large. Max size is 5MB.", false));
        }
        return res.status(400).json(errorResponse(400, err.message, false));
      } else if (err) {
        return res.status(400).json(errorResponse(400, err.message, false));
      }
      next();
    });
  } catch (error) {
    return res.status(500).json(errorResponse(500, "Something went wrong", false));
  }
};
