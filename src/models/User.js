import mongoose from "mongoose";
const userSchema = new mongoose.Schema({

    email: { type: String, default: null },
    password:{type:String},
    mobile: { type: String, default: null },
    

  });
  
  const User = mongoose.model("User", userSchema);
  export default User;