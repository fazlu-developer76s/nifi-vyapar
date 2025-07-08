import mongoose from "mongoose";
import { encryp, decryp } from "../utils/cryptoHelper.js";

const categorySchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category_name: {
      type: String,
      required: true,
      trim: true,
      set: (v) => encryp(v.toString()),
      get: (v) => decryp(v),
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);
categorySchema.virtual('category_name_decrypted').get(function () {
  return decryp(this.category_name);
});

export const Category = mongoose.model("Category", categorySchema);
