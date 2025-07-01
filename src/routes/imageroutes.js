import { Router } from "express";
import { uploadimage } from "../controller/imageuploadController.js";
import { upload  } from "../middlewares/multer.js";

const uploadrouter = Router();

uploadrouter.post("/upload",upload.single("image"),uploadimage);

export default uploadrouter;