import mongoose from "mongoose";

const hsnSchema = new mongoose.Schema(
  {
    HSNcode: {
      type: String,
      required: true,
      
      trim: true,
    },
    description: {
      type: String,
      required: true,
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

export default mongoose.model("HSN", hsnSchema);
