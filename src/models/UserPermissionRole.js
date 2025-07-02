import mongoose from "mongoose";

const userpermissionroleSchema=new mongoose.Schema({
    RoleId:{ type: mongoose.Schema.Types.ObjectId, ref: "Role",required:true},
    PermissionId:{type: mongoose.Schema.Types.ObjectId, ref: "PermissionCategory",required:true},
    SubPermissionId:{type: mongoose.Schema.Types.ObjectId, ref: "PermissionSubCategory",required:true},
    status:{ type: String, enum: ["active", "inactive"], default: "active" },
},{timestamps:true})

export default mongoose.model("rolePermission", userpermissionroleSchema);