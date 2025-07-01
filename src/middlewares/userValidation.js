import { decryptData } from "../lib/encrypt.js";
import { errorResponse } from "../lib/reply.js";
import { gstValidationSchema} from "../utils/valgst.js";
import { signuplogSchema } from "../utils/valgst.js";
import { adminLoginSchema } from "../utils/valgst.js";
import { validateCompany } from "../utils/valgst.js";
import { validatePackage } from "../utils/valgst.js";
import { validateSeo } from "../utils/valgst.js";
import { validateParty } from "../utils/valgst.js";
import { validateAdminRole } from "../utils/valgst.js";
import { validateMember } from "../utils/valgst.js";
import { categoryItemValidationSchema } from "../utils/valgst.js";
import { gsttaxValidationSchema } from "../utils/valgst.js";
import { gstupdatetaxValidationSchema } from "../utils/valgst.js";
import { itemCodeValidationSchema } from "../utils/valgst.js";
import { productValidationSchema } from "../utils/valgst.js";
import { productUpdateValidationSchema } from "../utils/valgst.js";
import { serviceItemValidationSchema } from "../utils/valgst.js";
import { secondaryUnitValidationSchema } from "../utils/valgst.js";
import { ServiceCodeItemValidationSchema } from "../utils/valgst.js";
import { serviceUpdateItemValidationSchema } from "../utils/valgst.js";
import { validateUpdateMember } from "../utils/valgst.js";
import { validateUpdatePackage } from "../utils/valgst.js";
import { validateUpdateAdminRole } from "../utils/valgst.js";
import { primaryUnitUpdateValidationSchema } from "../utils/valgst.js";
import { secondaryUnitUpdateValidationSchema } from "../utils/valgst.js";
import { validateUpdateCompany } from "../utils/valgst.js";
import { roleValidationSchema } from "../utils/valgst.js";




const validateSchema = (schema) => async (req, res, next) => {
  try {
    const encrypted = req.body?.body;
    if (!encrypted) {
      return res
        .status(400)
        .json(errorResponse("NOK", [], "Encrypted payload (body) is required"));
    }

    const decrypted = decryptData(encrypted);

    if (!decrypted) {
      return res
        .status(400)
        .json(errorResponse("NOK", [], "Failed to decrypt the payload"));
    }

    const dataToValidate = JSON.parse(decrypted);

    req.body = dataToValidate;

    const { error } = schema.validate(dataToValidate, { abortEarly: false });

    if (error) {
      console.log("* Validation error *");
      console.log("* Validation error *", error);

      const errorDetails = error.details.map((detail) => {
        console.log("Validation Detail:", detail);
        return {
          message: detail.message,
          path: detail.path,
          type: detail.type,
        };
      });

      return res
        .status(400)
        .json(errorResponse("NOK", errorDetails, "Insert correct value"));
    }

    next();
  } catch (err) {
    console.error("Error during validation and decryption:", err);

    return res
      .status(400)
      .json(
        errorResponse(
          "NOK",
          [
            {
              message: "Failed to decrypt or validate payload",
              error: err.message,
            },
          ],
          "Payload error"
        )
      );
  }
};

const AllvalidateSchema = (schema) => async (req, res, next) => {
  const { body } = req.body;
  const decryptedBody = decryptData(body);
  const parsedBody = JSON.parse(decryptedBody);
  console.log(parsedBody);
  const { error } = schema?.validate(parsedBody, { abortEarly: false });
  if (error) {
    const errorDetails = error.details.map((detail) => ({
      message: detail.message,
      path: detail.path,
      type: detail.type,
    }));

    res.status(400).json(errorResponse("NOK", errorDetails, "Insert correct value"));
    return;
  }
  req.decryptedBody = parsedBody;
  next();
};




export { AllvalidateSchema, validateSchema };
