import mongoose from "mongoose";

const UsermemberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: { type: String, default: null },
  email: { type: String, default: null },
  mobile: { type: String, default: null },
  status: { type: String },
  role: { type: mongoose.Schema.Types.ObjectId, ref: "UserRole" },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Usermember = mongoose.model("Usermember", UsermemberSchema);
