import mongoose from "mongoose";

const secondaryUnitSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // actionBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "AdmCompany"},
  },
  { timestamps: true }
);

export default mongoose.model("SecondaryUnit", secondaryUnitSchema);
