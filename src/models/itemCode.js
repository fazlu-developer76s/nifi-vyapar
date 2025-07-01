import mongoose from 'mongoose';

const itemCodeSchema = new mongoose.Schema({
  code: { type: String, required: true },
  actionBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdmCompany',
  },

}, { timestamps: true });

export default mongoose.model('ItemCode', itemCodeSchema);
