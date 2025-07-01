import { errorResponse, successResponse } from "../lib/reply.js";
import { imageuploadOnCloudinary } from "../utils/cloudinary.js";

export const uploadimage = async (req, res) => {
  try {
    const localpath = req.file?.path;
    const imageRegex = /.*\.jfif$/;

    if (localpath && imageRegex.test(localpath)) {
      return res
        .status(404)
        .json(
          errorResponse(
            404,
            "This image file is not supported, please choose a different image file",
            false
          )
        );
    }
    const uploadcloud = await imageuploadOnCloudinary(localpath);

    if (!uploadcloud) {
      return res
        .status(404)
        .json(errorResponse(404, "you are not Provide image", false));
    }
    const result = uploadcloud.image;
    return res
      .status(200)
      .json(successResponse(200, "success", "", true, result));
  } catch (error) {
    console.log(error)
    const errorRes = errorResponse(503, "Something went wrong", false, error);
    return res.status(503).json(errorRes);
  }
};
