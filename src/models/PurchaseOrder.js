import mongoose from "mongoose";

const purchaseOrderSchema = new mongoose.Schema(
  {
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
    Billingname: { type: String },
    PhnNo: { type: String },
    OrderNO: { type: String },
    OrderDate: { type: Date },
    DueDate: { type: Date },
    status: {
      type: String,
      enum: ["order overdue", "order completed", "processing"],
    },

    productItem: [
      {
        item: [{ type: mongoose.Schema.Types.ObjectId, ref: "Productitem" }],
        qty: { type: String },
        unit: [{ type: mongoose.Schema.Types.ObjectId, ref: "Unit" }],
        pricePerUnit: {
          withTax: { type: String },
          withoutTax: { type: String },
        },

        taxRef: [{ type: mongoose.Schema.Types.ObjectId, ref: "Gst" }],

        addCess: { type: String },
        amount: { type: String },
      },
    ],
    roundoff: { type: String },

    totalAmount: { type: String },
    advancedAmount: { type: String },
    paymentType: {
      type: String,
      enum: ["Cash", "Credit", "Debit", "UPI", "Net Banking", "Cheque"],
    },
    Description: { type: String },
    tax: { type: String },
    type: { type: String, default: "Purchase Order" },
    // action: [
    //   {
    //     type: String,
    //     enum: ["convert to Purchase"],
    //   },
    // ],
    balance: { type: String },
    invoiceNo: { type: String },
    userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  },
  
  { timestamps: true }
);

const PurchaseOrder = mongoose.model("PurchaseOrder", purchaseOrderSchema);
export default PurchaseOrder;
