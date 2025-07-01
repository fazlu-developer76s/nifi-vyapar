import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, default: null },
  mobile: { type: String, default: null },
  otp: { type: String },
  otpExpires: { type: Date },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // expires after 5 minutes
  }
});

export const UserOtp = mongoose.model("UserOtp", otpSchema);
