import mongoose from "mongoose";

const saleInvoiceSchema = new mongoose.Schema(
  {
    partyId: { type: mongoose.Schema.Types.ObjectId, ref: "Party" },
    Billingname: { type: String },
    PhnNo: { type: String },
    // PONo: { type: String },
    // PODate: { type: Date },
    // EwayBillNo: { type: String },
    InvoiceNO: { type: String },
    InvoiceDate: { type: Date },
    paymentTerms: {
      type: String,
      enum: ["custom", "Due on Reciept", "Net15", "Net30", "Net45", "Net60"],
    },
    status: {
      type: String,
      enum: ["paid", "unpaid", "overdue", "partially paid"],
    },
    stateofsupply: {
      type: String,
      enum: [
        "Andaman and Nicobar Islands",
        "Andhra Pradesh",
        "Arunachal Pradesh",
        "Assam",
        "Bihar",
        "Chandigarh",
        "Chhattisgarh",
        "Dadra and Nagar Haveli and Daman and Diu",
        "Delhi",
        "Goa",
        "Gujarat",
        "Haryana",
        "Himachal Pradesh",
        "Jammu and Kashmir",
        "Jharkhand",
        "Karnataka",
        "Kerala",
        "Ladakh",
        "Lakshadweep",
        "Madhya Pradesh",
        "Maharashtra",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Odisha",
        "Puducherry",
        "Punjab",
        "Rajasthan",
        "Sikkim",
        "Tamil Nadu",
        "Telangana",
        "Tripura Uttar Pradesh Uttarakhand West Bengal",
      ],
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
    roundoff: { type: String },
    overallDiscount: {
      type: { type: String, enum: ["percentage", "amount"] },
      value: { type: String },
    },
    totalAmount: { type: String },
    recieved: { type: String },
    paymentType: { type: mongoose.Schema.Types.ObjectId, ref: "Bank" },
    Description: { type: String },
    image: { type: String },
    transactionType: { type: String, default: "Sale" },
    type: { type: String, enum: ["credit", "cash"] },
    balance: { type: String },
    tax:{type: String},
    
  },
  { timestamps: true }
);
export default mongoose.model("SaleInvoice", saleInvoiceSchema);
