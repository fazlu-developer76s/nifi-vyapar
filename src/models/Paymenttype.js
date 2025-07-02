import mongoose from "mongoose";

const paymentTypeSchema = new mongoose.Schema({
    paymentType:{ type: mongoose.Schema.Types.ObjectId,
        ref: "Bank",},
 status:{type:String,enum:["active","inactive"],default:"active"},
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
 
},{timestamps:true})
export default mongoose.model("Paymenttype", paymentTypeSchema);