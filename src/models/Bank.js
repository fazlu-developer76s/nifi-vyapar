import mongoose from "mongoose";

const bankSchema = new mongoose.Schema(
  {
    accountDisplayName: {
      type: String,
    },
    Balance: {
      type: String,
    },
    asOfDate: {
      type: Date,
    },
    accountnumber: {
      type: String,
    },
    ifscCode: {
      type: String,
    },
    upiId: {
      type: String,
    },
    bankName: {
      type: String,
    },
    accountHolderName: {
      type: String,
    },
    branch: {
      type: String,
    },
    upiIdName: {
      type: String,
    },
    actionBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdmCompany",
    },
   
      
     status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    AccountTypeId:{type: mongoose.Schema.Types.ObjectId,ref:"AccountType"},
    userId:{
         type: mongoose.Schema.Types.ObjectId,
        ref: "User"
        }
  },
  { timestamps: true }
);

const Bank = mongoose.model("Bank", bankSchema);
export default Bank;