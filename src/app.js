import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import { connectDB } from "./db/dbConfig.js";
import authRouter from "./routes/auth.routes.js";
import { encryp, decryp } from "./utils/cryptoHelper.js";
import roleRouter from "./routes/role.route.js";
import { Role } from "./models/role.model.js";
import categoryRouter from "./routes/category.route.js";
import companiesRouter from "./routes/company.route.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
connectDB();
try {
  const findAdminRole = await Role.findOne({ role: "admin" });
  if(!findAdminRole) {
    await Role.create({
      role: "admin",
      status: "active",  // ✅ use boolean, not "active"
    });
    console.log("Role created");
  }
} catch (err) {
  console.error("Error creating role:", err);
}
app.get("/", async (req, res) => {
    res.send("hello welcome to nifi vyapar api");
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
app.use("/api/role", roleRouter);
app.use("/api/category", categoryRouter);
app.use("/api/company",companiesRouter)
export default app;
