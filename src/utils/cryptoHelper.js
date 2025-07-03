import crypto from "crypto";
import dotenv from "dotenv";
 
dotenv.config();
 
 
const algorithm = process.env.algo;
const secretKeyHex = process.env.SECRET_KEY;
const ivHex = process.env.IV;
if (secretKeyHex.length !== 64) throw new Error("Invalid SECRET_KEY length: must be 32 bytes");
if (ivHex.length !== 32) throw new Error("Invalid IV length: must be 16 bytes");

const key = Buffer.from(secretKeyHex, "hex");
const iv = Buffer.from(ivHex, "hex");

if (key.length !== 32) throw new Error("Invalid SECRET_KEY length: must be 32 bytes");
if (iv.length !== 16) throw new Error("Invalid IV length: must be 16 bytes");
 
export const encryp = (data) => {
    try {
        const text = typeof data === "string" ? data : JSON.stringify(data);
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(text, "utf8", "hex");
        encrypted += cipher.final("hex");
        return encrypted;
    } catch (error) {
        console.error("Encryption error:", error);
        return null;
    }
};
 
const isValidHex = (str) => /^[0-9a-fA-F]+$/.test(str);
 
export const decryp = (encryptedText) => {
    try {
        if (!isValidHex(encryptedText)) {
            throw new Error('Invalid hex string');
        }
 
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(encryptedText, "hex", "utf8");
        decrypted += decipher.final("utf8");
 
        try {
            return JSON.parse(decrypted);
        } catch {
            return decrypted;
        }
    } catch (error) {
        return null;
    }
};
 
export const decryptRecursive = (data, shouldDecrypt = () => true) => {
    try {
        if (data instanceof Date) return data;
 
        if (Array.isArray(data)) {
            return data.map((item) => decryptRecursive(item, shouldDecrypt));
        } else if (typeof data === "object" && data !== null) {
            return Object.fromEntries(
                Object.entries(data).map(([key, value]) => [
                    key,
                    decryptRecursive(shouldDecrypt(key, value) ? value : value, shouldDecrypt),
                ])
            );
        } else if (typeof data === "string") {
            const decrypted = decryp(data);
            return decrypted !== null ? decrypted : data;
        }
 
        return data;
    } catch (error) {
        console.error("Error in decryptRecursive:", error);
        return data;
    }
};
 
export const apiEncryp = (data, secretKeyHex, ivHex) => {
    if (!secretKeyHex || !ivHex) {
        console.error("API key or IV is missing");
        return null;
    }
    const apkey = Buffer.from(secretKeyHex, "hex");
    const apiv = Buffer.from(ivHex, "hex");
    if (apkey.length !== 32) throw new Error("Invalid SECRET_KEY length: must be 32 bytes");
    if (apiv.length !== 16) throw new Error("Invalid IV length: must be 16 bytes");
    try {
        const text = typeof data === "string" ? data : JSON.stringify(data);
        const cipher = crypto.createCipheriv(algorithm, apkey, apiv);
        let encrypted = cipher.update(text, "utf8", "hex");
        encrypted += cipher.final("hex");
        return encrypted;
    } catch (error) {
        console.error("Encryption error:", error);
        return null;
    }
};
 
export const apiDecryp = (encryptedText, secretKeyHex, ivHex) => {
    if (!isValidHex(encryptedText)) {
        return false;
    }
    const apkey = Buffer.from(secretKeyHex, "hex");
    const apiv = Buffer.from(ivHex, "hex");
    if (apkey.length !== 32) throw new Error("Invalid SECRET_KEY length: must be 32 bytes");
    if (apiv.length !== 16) throw new Error("Invalid IV length: must be 16 bytes");
    const decipher = crypto.createDecipheriv(algorithm, apkey, apiv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
 
    try {
        return JSON.parse(decrypted);
    } catch {
        return decrypted;
    }
};
 
export function encryptFields(data, excludeKeys = []) {
    const encryptedData = {};
 
    for (const key in data) {
        if (data[key] !== undefined && data[key] !== null) {
            encryptedData[key] = excludeKeys.includes(key)
                ? data[key] // ⛔ skip encryption for excluded keys
                : encryp(data[key]); // ✅ encrypt all others
        }
    }
 
    return encryptedData;
}
 