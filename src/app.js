import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import { connectDB } from "./db/dbConfig.js";
import authRouter from "./routes/auth.routes.js";
import { encryp, decryp } from "./utils/cryptoHelper.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
connectDB();
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

app.post("/api/encrypt", (req, res) => {
  const encryptedData = encryp(req.body);
  if (encryptedData) {
    res.json({ encrypted: encryptedData });
  } else {
    res.status(500).json({ error: "Encryption failed" });
  }
});

app.post("/api/decrypt", (req, res) => {
  const decryptedData = decryp(req.body.body);
  if (decryptedData) {
    res.json({ decrypt: decryptedData });
  } else {
    res.status(500).json({ error: "Decryption failed" });
  }
});

app.use("/api/auth", authRouter);
export default app;
