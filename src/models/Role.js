import mongoose from "mongoose";

const RoleSchema=new mongoose.Schema({
    Role:{type:String,
        enum:["1",
            "2",
            "3",
            "4",   
            "5",
            "6",
            "7"
        ]
    },
// Admin="1","Secondary Admin"="2", Salesman,Biller="3", Biller and Salesman="5",CA/Accountant="6",Stock Keeper="7",


    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
      },
    userId:{ type: mongoose.Schema.Types.ObjectId, ref: "User"},

},
{timestamps:true})

export default mongoose.model('Role', RoleSchema);
