import mongoose from "mongoose";
import { encryptData } from "../lib/encrypt.js";
const userSchema = new mongoose.Schema({
  email: { type: String, default: null },
  password: { type: String },
  mobile: { type: String, default: null },
  avatar: {
    type: String,
    default: encryptData(JSON.stringify(null))?.encryptedData,
  },
  name: {
    type: String,
    default: encryptData(JSON.stringify(null))?.encryptedData,
  },
  address: {
    type: String,
    default: encryptData(JSON.stringify(null))?.encryptedData,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
