import mongoose from "mongoose";

const permissionSubCategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PermissionCategory",
      required: true,
    },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // actionBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "AdmCompany",
    // },
  },
  { timestamps: true }
);

export default mongoose.model(
  "PermissionSubCategory",
  permissionSubCategorySchema
);
