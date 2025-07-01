import mongoose from "mongoose";

const ServiceCodeItemSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      default:null
      
    },
 
  },
  { timestamps: true }
);

export default mongoose.model("ServiceItemCode", ServiceCodeItemSchema);
