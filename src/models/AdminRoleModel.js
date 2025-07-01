import mongoose from "mongoose";

const adminRoleSchema = new mongoose.Schema({
    AdminRolename: { type: String, default: null },
    status: { type: String, default: null },
}, { timestamps: true });     

export const AdminRole = mongoose.model("AdminRole", adminRoleSchema);
