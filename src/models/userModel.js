import mongoose from "mongoose";

const UserModel = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
const User = mongoose.model('User', UserModel);
export default User;