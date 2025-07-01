import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    serviceName: { type: String },
    serviceHSN: { type: String },
    selectUnit: {
      baseUnit: { type: mongoose.Schema.Types.ObjectId, ref: "PrimaryUnit" },
      secondaryUnit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SecondaryUnit",
      },
      conversionRate: { type: String, default: null },
    },

    itemImage: { type: String },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CategoryItem",
      required: true,
    },

    serviceCode: { type: String, unique: true },

    pricing: {
      salePrice: {
        withTax: { type: String },
        withoutTax: { type: String },
        discount: {
          type: { type: String, enum: ["percentage", "amount"] },
          value: { type: String },
        },
      },
      taxRate: { type: mongoose.Schema.Types.ObjectId, ref: "Gst" },
    },

    onlineStore: {
      onlineStorePrice: { type: String },
      description: { type: String },
    },
    // actionBy:{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "AdmCompany"
    // },

    // image: { type: String, default: null }
  },
  { timestamps: true }
);

export default mongoose.model("ServiceItem", serviceSchema);
