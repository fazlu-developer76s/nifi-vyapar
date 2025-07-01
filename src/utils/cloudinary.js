import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"


cloudinary.config({
    cloud_name: "dvcuhquix",
    api_key:"894357282565881",
    api_secret:"OPa621cQJR1VoqFuSHVeAHg2ySk",
})



const imageuploadOnCloudinary = async (localpath) => {


    if (!localpath) {
        return null
    }

    let image = null;
    let video = null;
    // let pdf = null;
    try {
        const imagePath = localpath.match(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i)
        if (imagePath) {
            const result = await cloudinary.uploader.upload(localpath, {
                resource_type: "image",
                folder: "Web_creator"
                // timestamp: timestamp,
            });
            image = result.secure_url
        } else if (localpath.match(/\.(mp4|mkv|mov|avi)$/i)) {
            const videoUploadResult = await cloudinary.uploader.upload(localpath, {
                resource_type: "video",
                folder: "Web_creator"
                // timestamp: timestamp,
            });
            video = videoUploadResult.secure_url;
        } else {
            return { message: "Invalid file", success: false };
        }
        try {
            fs.rm(localpath, { force: true }, (unlinkError) => {
                if (unlinkError) {
                    return { message: "Failed to remove file", success: false, error: unlinkError.message };
                } else {
                    return { message: "File removed successfully", success: true };
                }
            });
        } catch (unlinkError) {
            return { message: "Error during file removal", success: false, error: unlinkError.message };
        }
        return { image, video }
    } catch (error) {
        throw Error(error)
    }
}

export const uploadToCloudinary = (filePath, folderName = 'exports') => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        resource_type: 'raw',
        folder: folderName,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
  });
}


export { imageuploadOnCloudinary }