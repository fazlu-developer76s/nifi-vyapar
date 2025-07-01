import mongoose from "mongoose";

const paymentOutAndInSchema = new mongoose.Schema(
    {
       partyId:{type: mongoose.Schema.Types.ObjectId, ref: "Party"},
       paymentOutAndInType:{type: mongoose.Schema.Types.ObjectId, ref: "Bank"},
       RecieptNo:{type:String},
       date :{type:Date},
       Recieved:{type:String},
       paid:{type:String},
       description:{type:String},
       discount:{
        type:{type:String,enum:["percentage","amount"]},
        value:{type:String}
    },
        Total:{type:String},
},{timestamps:true})

export default mongoose.model("PaymentOutAndIn", paymentOutAndInSchema)