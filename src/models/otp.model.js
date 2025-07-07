import mongoose, { get } from "mongoose";
import { encryp, decryp } from "../utils/cryptoHelper.js";

const otpSchema = new mongoose.Schema(
  {
    otp: {
      type: String,
      required: true,
      trim: true,
      set: (v) => encryp(v.toString()),
      get: (v) => decryp(v), 
    },
    field_value: {
      type: String,
      required: true,
      trim: true,
      set: (v) => encryp(v.toString()),
      get: (v) => decryp(v), 
    },
    type: {
      type: String,
      enum: ["email", "mobile"],
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    otp_status: {
      type: String,
      enum: ["pending", "verified", "expired"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);
otpSchema.virtual('otp_decrypted').get(function () {
  return decryp(this.otp);
});

export const Otp = mongoose.model("Otp", otpSchema);
