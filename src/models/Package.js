import mongoose from "mongoose";

const packageSchema= new mongoose.Schema({
    packageName:{type:String,default:null},
    status:{type:String,default:null},
    price:{type:String,default:null}
},{timestamps:true})

export const Package=mongoose.model("Package",packageSchema)