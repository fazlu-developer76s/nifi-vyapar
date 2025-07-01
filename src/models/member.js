import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
    name: { type: String, default: null },
    email: { type: String, default: null },
    mobile: { type: String, default: null },
    status:{type:String},
    role: { type: mongoose.Schema.Types.ObjectId, ref: "AdminRole"},
    createdAt: {
        type: Date,
        default: Date.now,
    },
    });

   export const Member = mongoose.model("Member", memberSchema);