import mongoose from "mongoose";

// const productSchema = new mongoose.Schema({
//   itemName: { type: String, required: true },
//   itemHSN: { type: String },
//   selectUnit: {
//     baseUnit: { type: String },
//     secondaryUnit: { type: String }
//   },
//   itemImage: { type: String }, // image URL or base64
//   category: { type: String }, // 🔐 encrypted string, not ObjectId
//   itemCode: { type: String, unique: true },

//   pricing: {
//     salePrice: {
//       withTax: { type: String },
//       withoutTax: { type: String },
//       discount: {
//         type: { type: String, enum: ["percentage", "amount"] },
//         value: { type: String }
//       }
//     },
//     purchasePrice: {
//       withTax: { type: String },
//       withoutTax: { type: String }
//     },
//     // taxes: { type: String } // tax names or codes, encrypted
//     taxRate: { type: String }
//   },

//   stock: {
//     openingQuantity: { type: String },
//     atPrice: { type: String },
//     asOfDate: { type: Date },
//     minStockToMaintain: { type: String },
//     location: { type: String }
//   },

//   onlineStore: {
//     onlineStorePrice: { type: String },
//     description: { type: String }
//   }
// }, { timestamps: true });
// const productSchema = new mongoose.Schema({
//   itemName: { type: mongoose.Schema.Types.ObjectId, ref: "CategoryItem", required: true }, // Ref to CategoryItem
//   itemHSN: { type: String },

//   selectUnit: {
//     baseUnit: { type: mongoose.Schema.Types.ObjectId, ref: "PrimaryUnit" },      // Ref to PrimaryUnit
//     secondaryUnit: { type: mongoose.Schema.Types.ObjectId, ref: "SecondaryUnit" },
//     conversionRate: { type: String, default: null } // Ref to SecondaryUnit
//   },

//   itemImage: { type: String },
//   category: { type: String }, // 🔐 Encrypted string (not a reference as per your original design)

//   itemCode: { type: mongoose.Schema.Types.ObjectId, ref: "ItemCode", unique: true }, // Ref to ItemCode

//   pricing: {
//     salePrice: {
//       withTax: { type: String },
//       withoutTax: { type: String },
//       discount: {
//         type: { type: String, enum: ["percentage", "amount"] },
//         value: { type: String }
//       }
//     },
//     purchasePrice: {
//       withTax: { type: String },
//       withoutTax: { type: String }
//     },
//     taxRate: { type: mongoose.Schema.Types.ObjectId, ref: "Gst" } // Ref to Taxes
//   },

//   stock: {
//     openingQuantity: { type: String },
//     atPrice: { type: String },
//     asOfDate: { type: Date },
//     minStockToMaintain: { type: String },
//     location: { type: String }
//   },

//   onlineStore: {
//     onlineStorePrice: { type: String },
//     description: { type: String }
//   }
// }, { timestamps: true });

// export default mongoose.model("Productitem", productSchema);


const productSchema = new mongoose.Schema(
  {
    itemName: { type: String },

    itemHSN: { type: String },

    selectUnit: {
      baseUnit: { type: mongoose.Schema.Types.ObjectId, ref: "PrimaryUnit" },
      secondaryUnit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SecondaryUnit",
      },
      conversionRate: { type: String, default: null },
    },

    itemImage: { type: String },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CategoryItem",
      required: true,
    },
    Godownid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Godown",
      required: true,
    },

    itemCode: { type: String},

    pricing: {
      salePrice: {
        withTax: { type: String },
        withoutTax: { type: String },
        discount: {
          type: { type: String, enum: ["percentage", "amount"] },
          value: { type: String },
        },
      },
      purchasePrice: {
        withTax: { type: String },
        withoutTax: { type: String },
      },
      taxRate: { type: mongoose.Schema.Types.ObjectId, ref: "Gst" },
    },

    stock: {
      openingQuantity: { type: String },
      atPrice: { type: String },
      asOfDate: { type: Date },
      minStockToMaintain: { type: String },
      location: { type: String },

      stockQuantity: {
        type: String,
        default: 0,
      },
      reservedQuantity: {
        type: String,
        default: 0,
      },

      availableForSale: {
        type: String,
        default: 0,
      },

      stockValue: {
        type: String,
        default: 0,
      },
    },

    onlineStore: {
      onlineStorePrice: { type: String },
      description: { type: String },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    date:{type:Date},
    // actionBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "AdmCompany",
    // },

    // image:{type:String,
    //   default:null
    // }
  },

  { timestamps: true }
);




export default mongoose.model("Productitem", productSchema);
