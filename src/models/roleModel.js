import moongose from 'mongoose';

const Rolemodel = moongose.Schema({
    userID:{
        type: moongose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    role: {
        type: String,
        required: true,
        unique: true,
    },  
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive'],
        required: true
    },
}, {
    timestamps: true,
});
const Role = moongose.model('Role', Rolemodel);
export default Role;