import mongoose from "mongoose";

const chequeSchema = new mongoose.Schema({
  bankId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bank",
    
  },
  chequeSerialNumber: {
    type: String,

  },
  from: {
    type: String,
   
  },
  to: {
    type: String,
    // required: true,  
  },
  numberOfLeaves: {
    type: String,
    // required: true, 
  },
  status: {
    type: String,
    enum: ["active", "used", "cancelled","unused"],  
    default: "active",                     
  },
  actionBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AdmCompany",
      },
  userId:{
     type: mongoose.Schema.Types.ObjectId,
    ref: "User"
    }
});
export default mongoose.model("Cheque", chequeSchema);
