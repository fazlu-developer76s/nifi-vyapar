import mongoose from "mongoose";

const IMEISchema = new mongoose.Schema(
  {
    imeiNumber: { type: String, required: true },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Productitem",
      required: true,
    },
    status: {
      type: String,
      enum: ["in_stock", "sold", "returned", "damaged"],
    },
  },
  { timestamps: true }
);
export default mongoose.model("IMEI", IMEISchema);
