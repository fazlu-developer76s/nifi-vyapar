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
    address:{type:String},
    gstIn: { type: String },
       members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usermember",
      },
    ],
  },
  { timestamps: true }
);

export const AdmCompany = mongoose.model("AdmCompany", AdmcompanySchema);
