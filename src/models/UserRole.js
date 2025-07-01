import mongoose from "mongoose";

const UserRoleSchema = new mongoose.Schema({
    UserRolename: { type: String, default: null },
    status: { type: String, default: null },
   userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
       },
}, { timestamps: true });     

export const UserRole = mongoose.model("UserRole", UserRoleSchema);
