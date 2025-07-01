import mongoose from "mongoose";

const saleOrderSchema = new mongoose.Schema(
    { 
        partyId: { type: mongoose.Schema.Types.ObjectId, ref: "Party" },
        Billingname: { type: String },
        PhnNo: { type: String },
       OrderNO: { type: String },
       OrderDate: { type: Date },
       DueDate: { type: Date },
      status: {
          type: String,
          enum: ["order overdue", "order completed"],
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
        advancedAmount: { type: String },
        paymentType: { type: mongoose.Schema.Types.ObjectId, ref: "Bank" },
        Description: { type: String },
        image: { type: String },
        tax:{type:String},
        type: { type: String, default: "Sale Order" },
          action: [{
    type: String,
    enum: ["convert to sale"]
  }],
  balance:{type:String},
    },
      { timestamps: true }
    );
export default mongoose.model("saleOrder", saleOrderSchema);