import mongoose from "mongoose";
const adminSchema = new mongoose.Schema({
    email: { type: String, default: null },
    password:{type:String},
    mobile: { type: String, default: null },
  });
  
  const Admin = mongoose.model("Admin", adminSchema);
  export default Admin;