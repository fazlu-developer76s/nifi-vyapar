import mongoose from "mongoose";
import { decryp, encryp } from "../utils/cryptoHelper.js";


const partySchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    partyName: {
      type: String,
      required: true,
      trim: true,
      set: (v) => encryp(v.toString()),
      get: (v) => decryp(v),
    },

    gstin: {
      type: String,
      trim: true,
      maxlength: 15,
      set: (v) => encryp(v.toString()),
      get: (v) => decryp(v),
    },

    pan: {
      type: String,
      trim: true,
      maxlength: 10,
      set: (v) => encryp(v.toString()),
      get: (v) => decryp(v),
    },

    gstType: {
      type: String,
      enum: [
        "Unregistered",
        "Regular",
        "Composition",
        "Consumer",
        "Overseas",
        "SEZ",
        "Deemed Export",
      ],
    },

    selectedCompany: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      set: (v) => encryp(v.toString()),
      get: (v) => decryp(v),
    },

    phone: {
      type: String,
      trim: true,
      set: (v) => encryp(v.toString()),
      get: (v) => decryp(v),
    },

    state: {
      type: String,
    },

    billingAddress: {
      type: String,
      trim: true,
      set: (v) => encryp(v.toString()),
      get: (v) => decryp(v),
    },

    shippingAddress: {
      type: String,
      trim: true,
      set: (v) => encryp(v.toString()),
      get: (v) => decryp(v),
    },

    openingBalance: {
      type: Number,
      default: 0,
    },

    asOfDate: {
      type: Date,
    },

    creditLimitMode: {
      type: String,
      enum: ["no", "custom"],
      default: "no",
    },

    creditLimit: {
      type: Number,
    },

    contactPerson: {
      type: String,
      trim: true,
      set: (v) => encryp(v.toString()),
      get: (v) => decryp(v),
    },

    note: {
      type: String,
      trim: true,
      set: (v) => encryp(v.toString()),
      get: (v) => decryp(v),
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true }, 
    toObject: { getters: true },
  }
);


partySchema.virtual("partyName_decrypted").get(function () {
  return decryp(this.partyName);
});

export const Party = mongoose.model("Party", partySchema);
