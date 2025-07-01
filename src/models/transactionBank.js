import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      "credit",
      "debit",
   ],
    default: null
  },


  bankId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bank",
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  actionBy:{ type: mongoose.Schema.Types.ObjectId,
    ref: "AdmCompany"
  },

  refNo: { type: String },
  amount: { type: String },
  Balance: { type: String }, 
  closingBalance: { type: String },
  remark:{type:String},

  description: { type: String },


  date: {
    type: Date,
    default: Date.now,
  },
  status:{type:String,enum:["pending","failed","success"]}
}, { timestamps: true });

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
