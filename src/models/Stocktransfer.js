import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    transferdate: { type: Date, default: Date.now },
    From: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Godown",
      required: true,
    },
    To: { type: mongoose.Schema.Types.ObjectId, ref: "Godown", required: true },
    ItemName: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Productitem",
        required: true,
      },
    ],
    QuantityTotransfer: { type: String },
  

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Stock", stockSchema);
