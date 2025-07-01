import mongoose from "mongoose";
import { categorySchema } from "./Categorycms.js";


 const cmsSchema = new mongoose.Schema({
 userId: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
    },
  page: {
    type: String,
    required: true
  },
  sections: [categorySchema],
  status: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export const CMS=  mongoose.model("CMS", cmsSchema);