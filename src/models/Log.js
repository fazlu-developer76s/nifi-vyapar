import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  partyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Party', 
  },
  insertId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  type: {
    type: String,
    enum: ['sale', 'saleestimate',"paymentin","Sale Order","Estimate Quotation"],
    required: true,
  },
  event: {
    type: String,
    enum: ['create', 'update', 'delete',"convert","convert to sale",],
    required: true,
  },
  data: {
    type: Object,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Log = mongoose.model('Log', logSchema);
export default Log;
