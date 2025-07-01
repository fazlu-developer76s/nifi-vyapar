import { Schema } from "mongoose";
import { faqBlockSchema } from "./faqModel.js";
import { footerSchema } from "./FooterModel.js";
import { testimonialSchema } from "./testimonials.js";


export const categorySchema = new Schema({
  category: {
    type: String,
    required: true,
    enum: [
      "hero",
      "about",
      "solutions",
      "product-overview",
      "benefit-of-product",
      "targeted-segment",
      "faqs",
      "testimonial",
      "footer"
    ],
    //  unique: true
  },

  type: {
    type: String,
    enum: ["slider", "card"],
    // required: true
  },

  imageLocation: {
    type: Number,
    enum: [1, 2, 3], // 1: image only, 2: image left/text right, 3: image right/text left
    default: 1
  },

  image: {
    type: String,
    default: null
  },

  h1: {
    type: String,
    default: ""
  },

  description: {
    type: String,
    default: ""
  },

  h1Color: {
    type: String,
    default: ""
  },

  descriptionColor: {
    type: String,
    default: ""
  },

  h1FontFamily: {
    type: String,
    default: ""
  },

  descriptionFontFamily: {
    type: String,
    default: ""
  },

  buttonColor: {
    type: String,
    default: ""
  },

  buttonText: {
    type: String,
    default: ""
  },

  buttonUrl: {
    type: String,
    default: ""
  },
  faqs: {type:String},
  footer:{type:String},
  testimonials:{type:String},

   logo: {
    type: String,
    default: null
  },
  status: {
    type: Boolean,
    default: true
  },

}, {
  timestamps: true
});


// export const getUserBrandConfig = async (req, res) => {
//   const { page } = req.params;

//   try {
//     const cmsData = req.cmsData;  // Use the domain-specific CMS data

//     // Find the CMS config for the requested page
//     const cms = cmsData.sections.find(section => section.page === page);
//     if (!cms) return res.status(404).json({ message: "Page not found" });

//     // Prepare the brand config dynamically based on categories
//     const config = {};

//     for (const section of cms.sections) {
//       switch (section.category) {
//         case "hero":
//           config.hero = {
//             h1: section.h1,
//             description: section.description,
//             image: section.image,
//             buttonText: section.buttonText,
//             buttonUrl: section.buttonUrl,
//           };
//           break;

//         case "faqs":
//           config.faqs = section.faqs;
//           break;

//         case "footer":
//           config.footer = section.footer;
//           break;

//         case "testimonials":
//           config.testimonials = section.testimonials;
//           break;

//         default:
//           config[section.category] = section;
//       }
//     }

//     res.json({ page: cms.page, config });

//   } catch (error) {
//     res.status(500).json({ message: "Something went wrong", error });
//   }
// };
