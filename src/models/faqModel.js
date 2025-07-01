import { Schema } from "mongoose";

export const faqBlockSchema = new Schema({
    title:{type:String,required:true},
  faqs: [
   
    {
      question: { type: String, default: null},
      answer: { type: String,default: null }
    }
  ],
 
}, { timestamps: true });
