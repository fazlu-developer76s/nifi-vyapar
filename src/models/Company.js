import mongoose from "mongoose"

const companySchema=new mongoose.Schema({

    CompanyName:{type:String,default:null},
    CompanyDomain:{type:String},
    CompanyMobile:{type:String},
    Companyemail:{type:String},
    status: {
        type: String,
        default: true
      },
       userId: {
              type: mongoose.Schema.Types.ObjectId, ref: "User",
          }

},{ timestamps: true })

export const Company=  mongoose.model("Company", companySchema);