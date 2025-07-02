import mongoose from "mongoose";

const ProductVariantSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Productitem" },
  sku: { type: String },
  barcode: { type: String },
  quantity: { type: String },
  saleprice: { type: String },
  purchaseprice: { type: String },
   status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  userId:{type: mongoose.Schema.Types.ObjectId, ref: "User"},
},{timestamps:true});
const ProductVariant = mongoose.model("ProductVariant", ProductVariantSchema);
export default ProductVariant;
