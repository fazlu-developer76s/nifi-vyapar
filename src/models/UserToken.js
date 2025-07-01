import mongoose from "mongoose";

const userTokenSchema = new mongoose.Schema({
  token: { type: String, required: true }, // Encrypted Base64 token
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
}, { timestamps: true });

const UserToken = mongoose.model("UserToken", userTokenSchema);
export default UserToken;
