import mongoose from "mongoose";

const issuedChequeSchema = new mongoose.Schema({
  chequeSerialNumber: { type: mongoose.Schema.Types.ObjectId, ref: "Cheque" },
  party:{ type: mongoose.Schema.Types.ObjectId, ref: "Party" },
    issueDate: { type: String },
    issuedBy:{type:String},
  payee: { type: String },
  amount: { type: String },
  remarks: { type: String },
  status: { type: String, enum: ["issued", "cleared", "Rejected"], default: "issued" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: { type: String, enum: ["credit", "debit"] },
  toBankAccount: { type: mongoose.Schema.Types.ObjectId, ref: "Bank" },
  actionBy:{type: mongoose.Schema.Types.ObjectId, ref: "AdmCompany"}
});
export default mongoose.model("IssuedCheque", issuedChequeSchema);