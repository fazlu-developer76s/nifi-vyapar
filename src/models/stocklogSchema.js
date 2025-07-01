import mongoose from "mongoose";

const stockLogSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Add", "Reduce", "Adjust", "Opening","sale","purchasePrice",],
    required: true,
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Productitem",
    required: true,
    
  },
  godownId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Godown",
    required: true,
  },
  referenceNo: { type: String }, 
  status: {
    type: String,
    enum: ["Paid", "Unpaid","partially paid"],
    default: "Paid",
  },
  quantity: { type: Number, required: true },
  pricePerUnit: { type: Number, required: true },
userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  date: {
    type: Date,
    default: Date.now,
  },



      // New field for edit history
    editHistory: [
      {
        operationType: {
          type: String,
          enum: ["Add", "Reduce", "Adjust", "Opening","salePrice","purchasePrice"],
          required: true,
        },
        oldValues: {
          quantity: { type: Number },
          pricePerUnit: { type: Number },
        },
        newValues: {
          quantity: { type: Number },
          pricePerUnit: { type: Number },
        },
        modifiedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: false,
        },
        modifiedAt: {
          type: Date,
          default: Date.now,
        },
        reason: {
          type: String,
        },
      },
    ],
}, { timestamps: true });

export default mongoose.model("StockLog", stockLogSchema);
