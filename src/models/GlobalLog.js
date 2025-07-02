// models/GlobalLog.js
import mongoose from "mongoose";

const globalLogSchema = new mongoose.Schema(
  {
    endpoint: { type: String, required: true }, // e.g. "/api/purchase-order/create"
    method: {
      type: String,
      enum: ["POST", "PUT", "DELETE"],
      required: true,
    },

    action: {
      type: String,
      enum: [
        "CREATE",
        "UPDATE",
        "DELETE",
        "STATUS UPDATE",
        "PAYMENT",
        "LOGIN",
        "TRANSFER",
      ],
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    dataBefore: { type: mongoose.Schema.Types.Mixed }, // Snapshot before change
    dataAfter: { type: mongoose.Schema.Types.Mixed }, // Snapshot after change
    message: { type: String }, // Optional notes
  },
  { timestamps: true }
);

export default mongoose.model("GlobalLog", globalLogSchema);
