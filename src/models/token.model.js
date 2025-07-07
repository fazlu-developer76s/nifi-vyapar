import mongoose from "mongoose";
import { encryp, decryp } from "../utils/cryptoHelper.js";
const tokenSchema = new mongoose.Schema(
  {
        userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        },
        token: {
        type: String,
        required: true,
        trim: true,
        set: (v) => encryp(v.toString()),
        get: (v) => decryp(v), 
        },
        token_status  :{
        type: String,
        enum: ["active", "inactive"],
        default: "active",
        }
    },
    {
        timestamps: true,
    }
);
tokenSchema.virtual('token_decrypted').get(function () {
  return decryp(this.token);
});
export const Token = mongoose.model("Token", tokenSchema);
