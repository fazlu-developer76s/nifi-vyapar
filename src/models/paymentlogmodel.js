import mongoose from "mongoose";

const paymentlogSchema = new mongoose.Schema(
    {
party:{ type: mongoose.Schema.Types.ObjectId, ref: "Party" },
date:{type:Date},
type:{type:String,enum:["paymentIn","paymentOut","sale","purchase","Sale Order","Estimate Quotation"]},
total:{type:String},
recievedorpaid:{type:String},
Balance:{type:String},
paymentType:{type: mongoose.Schema.Types.ObjectId, ref: "Bank"},
},{timestamps:true});

export default mongoose.model("paymentlog", paymentlogSchema);