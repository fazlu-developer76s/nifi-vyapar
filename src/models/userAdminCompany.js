import mongoose from "mongoose";

const AdmcompanySchema = new mongoose.Schema(
  {
    CompanyName: { type: String, default: null },
    CompanyMobile: { type: String },
    Companyemail: { type: String },
    status: {
      type: String,default:"true"},
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const AdmCompany = mongoose.model("AdmCompany", AdmcompanySchema);
