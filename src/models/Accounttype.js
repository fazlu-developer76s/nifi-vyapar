import mongoose from "mongoose";

const accountTypeSchema = new mongoose.Schema(
  {
    type: {
      type: String,

required: true,
    },

    actionBy: {
      type: mongoose.Schema.Types.ObjectId,ref: "AdmCompany",

    },
    
    userId: {
      type: mongoose.Schema.Types.ObjectId,ref: "User",

    },
  },
  { timestamps: true }
);

export default mongoose.model("AccountType", accountTypeSchema);
