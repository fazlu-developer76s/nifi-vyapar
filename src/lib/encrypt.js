import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();
const algorithm = "aes-256-cbc";
const key = Buffer.from(
  process.env.ENCRYPTION_KEY ||
    "31501950d4c6ff1d80a1cd6508fc995d8139cec9c8013a2992a7ad57f366f51e",
  "hex"
);
const iv = Buffer.from(
  process.env.ENCRYPTION_IV || "674be798d1b047d906b0a40d108c6320",
  "hex"
);

const aes = Buffer.from(
  process.env.ENCRYPTION_AES ||
    "d1ef40c68da4df29e4a28df898c13b636748f6c56d3290027cf5946ca06f794a",
  "hex"
);
const ivv = Buffer.from(
  process.env.ENCRYPTION_IV2 || "58e45c94e3c0707abbe7ae9f12f4fff2",
  "hex"
);

// const genkey= crypto.randomBytes(32)
// const geniv= crypto.randomBytes(16)
// console.log(genkey)
// console.log(geniv)

function encryptData(text) {
  try {
    console.log(text);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return {
      iv: iv.toString("hex"),
      encryptedData: encrypted,
    };
  } catch (error) {
    return null;
  }
}
function isValidHex(str) {
  return (
    typeof str === "string" && /^[0-9a-fA-F]+$/.test(str) && str.length >= 32 // minimum length for AES-256-CBC encrypted data (at least 16 bytes)
  );
}
// function decryptData(encryptedData) {
//     console.log(encryptedData)
//     if (typeof encryptedData !== 'string' && !(encryptedData instanceof Buffer)) {
//         throw new TypeError('The "encryptedData" argument must be a string or Buffer.');
//     }

//     try {
//         const decipher = crypto.createDecipheriv(algorithm, key, iv);
//         let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
//         decrypted += decipher.final('utf8');
//         return decrypted;
//     } catch (error) {
//         console.error("Decryption Error:", error);
//         return null;
//     }
// }

function decryptData(encryptedData) {
  if (typeof encryptedData !== "string" && !(encryptedData instanceof Buffer)) {
    throw new TypeError(
      'The "encryptedData" argument must be a string or Buffer.'
    );
  }
  if (!isValidHex(encryptedData)) {
    return encryptedData;
  }
  try {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Decryption Error:", error);
    return null;
  }
}

const encryptRequestData = async (req, res) => {
  try {
    const text =
      typeof req.body === "object" ? JSON.stringify(req.body) : req.body;

    const encryptedData = encryptData(text);
    return res.status(200).json({ encrypted: encryptedData });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Encryption failed", error: error.message });
  }
};
// export { decryptRequestData };
const decryptRequestData = async (req, res) => {
  try {
    const encryptedData = req.body.body;
    if (!encryptedData) {
      return res?.status(400).json({ message: "No encrypted data found" });
    }

    const decryptedData = decryptData(encryptedData);
    const changePassint = JSON.parse(decryptedData);
    return res?.status(200).json({ decrypted: changePassint });
  } catch (error) {
    return res
      ?.status(500)
      .json({ message: "Decryption failed", error: error.message });
  }
};

function encryptDatanifi(text) {
  try {
    console.log(text);
    const cipher = crypto.createCipheriv(algorithm, aes, ivv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return {
      ivv: ivv.toString("hex"),
      encryptDatanifi: encrypted,
    };
  } catch (error) {
    return null;
  }
}

function decryptDatanifi(encryptDatanifi) {
  if (
    typeof encryptDatanifi !== "string" &&
    !(encryptDatanifi instanceof Buffer)
  ) {
    throw new TypeError(
      'The "encryptedData" argument must be a string or Buffer.'
    );
  }
  console.log(encryptDatanifi, "encryptedData1");
  try {
    const decipher = crypto.createDecipheriv(algorithm, aes, ivv);
    let decrypted = decipher.update(encryptDatanifi, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Decryption Error:", error);
    return null;
  }
}

const encryptRequestData1 = async (req, res) => {
  try {
    const text =
      typeof req.body === "object" ? JSON.stringify(req.body) : req.body;

    const encryptedData = encryptDatanifi(text);
    return res.status(200).json({ encrypted: encryptedData });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Encryption failed", error: error.message });
  }
};

const decryptRequestData1 = async (req, res) => {
  try {
    const encryptedData = req.body.body;
    if (!encryptedData) {
      return res?.status(400).json({ message: "No encrypted data found" });
    }

    const decryptedData = decryptDatanifi(encryptedData);
    const changePassint = JSON.parse(decryptedData);
    return res?.status(200).json({ decrypted: changePassint });
  } catch (error) {
    return res
      ?.status(500)
      .json({ message: "Decryption failed", error: error.message });
  }
};

export {
  encryptData,
  decryptData,
  decryptRequestData,
  encryptRequestData,
  encryptDatanifi,
  decryptDatanifi,
  encryptRequestData1,
  decryptRequestData1,
};
