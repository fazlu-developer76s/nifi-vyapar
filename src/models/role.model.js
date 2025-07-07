import mongoose from 'mongoose';
import { encryp, decryp } from '../utils/cryptoHelper.js';

const roleSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  role: {
    type: String,
    required: true,
    trim: true,
    set: (v) => encryp(v.toString()),
    get: (v) => decryp(v),
    
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
    required: true,
  },
}, {
  timestamps: true,
});
roleSchema.virtual('role_decrypted').get(function () {
  return decryp(this.role);
});

export const Role = mongoose.model('Role', roleSchema);
