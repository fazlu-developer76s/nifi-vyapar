import mongoose from 'mongoose';

const gstSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  rate: {
    type:String,
    required: true,
  },
  userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  // actionBy: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "AdmCompany",
  // },
}, { timestamps: true });

export default mongoose.model('Gst', gstSchema);
