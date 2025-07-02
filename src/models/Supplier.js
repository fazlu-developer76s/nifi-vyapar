import mongoose from "mongoose";
const addressSchema = new mongoose.Schema({
  billingAddress: { type: String },
  shippingAddress: { type: String },
  state: {
    type: String,
    enum: [
      "",
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
      'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
      'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
      'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
      'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
      'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
      'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
      'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
    ],
    default: ""
  }
});



const supplierSchema = new mongoose.Schema({
  supplierName: { type: String, required: true },
  gstIn: { type: String },
  phoneNumber: { type: String },
  panNo: { type: String },
  gstType: {
    type: String,
    enum: [
      "Regular",
      "Registered Business - Regular",
      "Unregistered",
      "Composition",
      "Consumer",
      "Overseas",
      "SEZ",
      "Deemed Export",
    ]
  },
  emailId: { type: String },
  address: addressSchema,

 
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });


const Supplier = mongoose.model("Supplier", supplierSchema);
export default Supplier;