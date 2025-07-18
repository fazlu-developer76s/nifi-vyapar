import mongoose from "mongoose";
import { decryp, encryp } from "../utils/cryptoHelper.js";

const companySchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    CompanyName: {
      type: String,
      required: true,
      trim: true,
      set: (v) => encryp(v.toString()),
      get: (v) => decryp(v),
    },

    CompanyMobile: {
      type: String,
      required: true,
      trim: true,
      set: (v) => encryp(v.toString()),
      get: (v) => decryp(v),
    },

    Companyemail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      set: (v) => encryp(v.toString()),
      get: (v) => decryp(v),
    },

    address: {
      type: String,
      required: true,
      trim: true,
      set: (v) => encryp(v.toString()),
      get: (v) => decryp(v),
    },

    gstIn: {
      type: String,
      trim: true,
      set: (v) => (v ? encryp(v.toString()) : v),
      get: (v) => (v ? decryp(v) : v),
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

companySchema.virtual("CompanyName_decrypted").get(function () {
  return decryp(this.CompanyName);
});
companySchema.virtual("gstIn_decrypted").get(function () {
  return this.gstIn ? decryp(this.gstIn) : "";
});


export const Company = mongoose.model("Company", companySchema);
