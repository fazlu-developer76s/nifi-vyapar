import mongoose from "mongoose";

const GodownSchema=new mongoose.Schema({
    GodownType:{
        type:String,
        enum:["Godown","Retail Store","WholeSale Store","Distributor","Assembly Plant","Others","Main Store"],
     default:"Main Store"
},
GodownName:{type:String},
emailId:{type:String},
PhnNo:{type:String},
gstIn:{type:String},
GodownAddress:{type:String},
GodownPincode:{type:String},
  userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      // acyionBy: {
      //   type: mongoose.Schema.Types.ObjectId,
      //   ref: "AdmCompany",
      // },
},{timestamps:true})

export default mongoose.model('Godown', GodownSchema);