import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
        otp: {
        type: String,
        required: true,
        trim: true,
        },
        field_value: {
        type: String,
        required: true,
        trim: true,
        },
        type: {
        type: String,
        enum: ["email", "mobile"],
        required: true,
        },
        expiresAt:{
        type: Date,
        required: true,
        
        }
    },
    {
        timestamps: true,
    }
);
export const Otp = mongoose.model("Otp", otpSchema);
