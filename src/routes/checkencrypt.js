import { Router } from "express";
import { decryptRequestData, decryptRequestData1, encryptRequestData, encryptRequestData1 } from "../lib/encrypt.js";

const chechkencrypt = Router();

chechkencrypt.post("/encrypt", encryptRequestData)
chechkencrypt.post('/decrypt',decryptRequestData);
chechkencrypt.post("/encr",encryptRequestData1);
chechkencrypt.post("/decr",decryptRequestData1);

export default chechkencrypt;
