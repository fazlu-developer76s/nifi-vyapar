import mongoose from 'mongoose';

const permissionCategorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
     userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
  
}, { timestamps: true });

export default mongoose.model('PermissionCategory', permissionCategorySchema);
