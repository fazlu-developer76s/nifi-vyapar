import mongoose from "mongoose";

const SeoSchema = new mongoose.Schema({
  page: { type: String, required: true, unique: true },           
  title: { type: String, required: true },                      
  description: { type: String, required: true },                
  keywords: { type: String, required: true },                    
  url: { type: String, required: true, unique: true },            
  image: { type: String, default: "" },                           
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" } 
}, { timestamps: true });

const Seo = mongoose.model("Seo", SeoSchema);

export default Seo;
