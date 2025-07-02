import mongoose from "mongoose";

const recievingStockSchema = new mongoose.Schema(
  {
    purchaseOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PurchaseOrder",
      required: true,
    },

    godownId: { type: mongoose.Schema.Types.ObjectId, ref: "Godown" },
    stock: { type: mongoose.Schema.Types.ObjectId, ref: "Stock" },
    itemInspections: [
      {
        productItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Productitem",
        },
        receivedQty: { type: String },

        recievingStatus: {
          type: String,
          enum: ["Recieved", "Rejected"],
          default: "Recieved",
        },
        qualityStatus: {
          type: String,
          enum: ["good", "damaged", "expired", "mismatch"],
          default: "good",
        },
        remarks: { type: String },
      },
    ],
    // overallStatus: {
    //   type: String,
    //   enum: ["Accepted", "Rejected", "Partially Accepted"],
    //   default: "Accepted",
    // },
    actionTaken: {
      type: String,
      enum: ["Stored", "Returned", "Hold", "Damaged Report Raised"],
    },
    inspectedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
export default mongoose.model("RecievingStock", recievingStockSchema);
