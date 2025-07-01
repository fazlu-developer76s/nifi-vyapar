// models/CategoryItem.js
import mongoose from "mongoose";

const categoryItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    // actionBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "AdmCompany",
    // },
  },
  { timestamps: true }
);

export default mongoose.model("CategoryItem", categoryItemSchema);
