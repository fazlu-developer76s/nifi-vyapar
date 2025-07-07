import mongoose from "mongoose";
import { encryp, decryp } from "../utils/cryptoHelper.js";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: null,
      trim: true,
      set: (v) => encryp(v.toString()),
      get: (v) => decryp(v), 
    },
    email: {
      type: String,
      default: null,
      trim: true,
      set: (v) => encryp(v.toString()),
      get: (v) => decryp(v), 
    },
    mobile: {
      type: String,
      default: null,
      trim: true,
      set: (v) => encryp(v.toString()),
      get: (v) => decryp(v), 
    },
    picture: {
      type: String,
      default: null,
      trim: true,
      set: (v) => encryp(v.toString()),
      get: (v) => decryp(v), 
    },
    password: {
      type: String,
      default: null,
      set: (v) => encryp(v.toString()),
      get: (v) => decryp(v), 
      trim: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    user_status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
  },
  {
    timestamps: true,
  }
);
userSchema.virtual('user_decrypted').get(function () {
  return decryp(this.name) || decryp(this.email) || decryp(this.mobile) || decryp(this.picture);
});
export const User = mongoose.model("User", userSchema);
