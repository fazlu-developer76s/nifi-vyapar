// models/Unit.js
import mongoose from "mongoose";

const unitSchema = new mongoose.Schema({
  unitName: { type: String, required: true },
  sortName: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Unit", unitSchema);
