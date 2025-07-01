
import mongoose from "mongoose"
const EstimateQuotationSchema = new mongoose.Schema({
  partyId: { type: mongoose.Schema.Types.ObjectId, ref: "Party", required: true },
  billingName: { type: String },
  refNo: { type: String },
  invoiceDate: { type: Date },
  stateOfSupply: {
    type: String,
    enum: [
      "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
      "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
      "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
      "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
      "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
      "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
    ]
  },
  status: {
    type: String,
    enum: ["Quotation open", "Quotation complete"],
    default: "open"
  },
  action: [{
    type: String,
    enum: ["convert to sale", "convert to sale order", "delete"]
  }],
  event: {
    type: String,
    enum: ["create", "read", "update", "delete"]
  },
  productItem:[{
  item: [{ type: mongoose.Schema.Types.ObjectId, ref: "Productitem" }],
  count: { type: String },
  qty: { type: String },
  freeQty: { type: String },
  unit: [{ type: mongoose.Schema.Types.ObjectId, ref: "Unit" }],
  pricePerUnit: {
    withTax: { type: String },
    withoutTax: { type: String }
  },
  
  taxRef: [{ type: mongoose.Schema.Types.ObjectId, ref: "Gst" }],
  
  addCess: { type: String },
  amount: { type: String }
  }], 

  roundOff: { type: String, default: "0" },
  overallDiscount: {
    type: { type: String, enum: ["percentage", "amount"] },
    value: { type: String }
  }, 
  // total GST of all items
  totalAmount: { type: String }, // final total including tax, discount, round off
  description: { type: String },
  image: { type: String },
  
  balanceDue: { type: String },

  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  // actionBy: { type: mongoose.Schema.Types.ObjectId, ref: "AdmCompany" }
}, { timestamps: true });

export default mongoose.model("EstimateQuotation", EstimateQuotationSchema);
